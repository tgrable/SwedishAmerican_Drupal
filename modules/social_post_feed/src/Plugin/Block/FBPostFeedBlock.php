<?php
/**
 * @file
 * Contains Drupal\social_post_feed\Plugin\Block\FBPostFeedBlock.
 */

namespace Drupal\social_post_feed\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Datetime\DrupalDateTime;

/**
 * Provides a 'Facebook Post Feed' Block.
 *
 * @Block(
 *   id = "social_post_feed",
 *   admin_label = @Translation("Facebook Post Feed"),
 * )
 */
class FBPostFeedBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->get_facebook_data(),
      '#attached' => array(
        'library' => array('social_post_feed/social_post_feed'),
      ),
    );
  }

  private function get_facebook_data() {
    //https://graph.facebook.com/swedishamericanrockford/posts?&access_token=751723765008561|f6c472d01ed65f420988cf67d0f40eb4&fields=updated_time,message,full_picture,shares,likes&limit=4
    $json_link = "https://graph.facebook.com/swedishamericanrockford/posts?&access_token=751723765008561|f6c472d01ed65f420988cf67d0f40eb4&fields=created_time,message,full_picture,shares,likes&limit=3";
    $json = file_get_contents($json_link);

    $obj = json_decode($json, true);
    
    // to get the post id
    $id = $obj['data'][0]['id'];
    $post_id_arr = explode('_', $id);
    $post_id = $post_id_arr[1];

    // when it was posted
    $created_time = $obj['data'][0]['created_time'];
    $converted_date_time = date( 'Y-m-d H:i:s', strtotime($created_time));
    $ago_value = $this->time_elapsed_string($converted_date_time);

    // user's custom message
    $message = $obj['data'][0]['message'];
    $trim_message = strlen($message) > 450 ? substr($message,0,450)."..." : $message;

    $markup = '<div class="large-padding"></div>';
    $markup .= '<div class="social-block">';
        $markup .= '<div class="header-title">';
          $markup .= '<div class="fa-social-background fb-blue inline">';
            $markup .= '<i class="fa fa-facebook">&nbsp;</i>';
          $markup .= '</div>';
        $markup .= '<div class="inline">';
          $markup .= '<p class="social-hdr">Facebook</p>';
        $markup .= '</div>';
      $markup .= '</div>';

    for($x = 0; $x < count($obj['data']); $x++){

        // to get the post id
        $id = $obj['data'][$x]['id'];
        $post_id_arr = explode('_', $id);
        $post_id = $post_id_arr[1];

        $reactions_url = 'https://graph.facebook.com/' . $id . '/?&access_token=751723765008561|f6c472d01ed65f420988cf67d0f40eb4&fields=reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like),reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love),reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow),reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad),reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry),reactions.type(THANKFUL).limit(0).summary(total_count).as(reactions_thankful)';
        $reactions_json =  file_get_contents($reactions_url);
        $reactions_obj = json_decode($reactions_json, true);

        // user's custom message
        $message = $obj['data'][$x]['message'];
        $trim_message = strlen($message) > 250 ? substr($message,0,250)."..." : $message;
    
        // picture from the link
        $picture = $obj['data'][$x]['full_picture'];
    
        // when it was posted
        $created_time = $obj['data'][$x]['created_time'];
        $converted_date_time = date( 'Y-m-d H:i:s', strtotime($created_time));
        $ago_value = $this->time_elapsed_string($converted_date_time);
    
        $likes = $obj['data'][$x]['likes'];
        // dsm($likes['data']);

        $shares = (isset($obj['data'][$x]['shares'])) ? $obj['data'][$x]['shares']['count'] : 0;

        $markup .= '<div class="fb-container social-card">';
          $markup .= '<div class="fb_article">';
          $markup .= '<div class="profile-data">';
            $markup .= '<img src="https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/16998879_1235916839789725_5701019738556990953_n.jpg?oh=aa1f12c6d2b71c8759b92aa63c1ec4de&oe=59B389D7" />';
            $markup .= '<a href="https://www.facebook.com/swedishamericanrockford" target="_blank">SwedishAmerican</a>';
            $markup .= "<p class='post-time'>{$ago_value}</p>";
          $markup .= '</div>';
            $markup .= "<div class='post-message'>{$trim_message}</div>";
            $markup .= "<div class='post_image'><img src='{$picture}' /></div>";
            $markup .= '<hr />';
            $markup .= '<div class="post_reactions"><div class="reactions inline">' . $this->getReactionCount($reactions_obj) . ' Reactions</div><div class="shares inline">' . $shares . ' Shares</div></div>' ;
          $markup .= "</div>";
        $markup .= "</div>";
    }
    $markup .= "</div>";
    return $markup;
  }

  // to get 'time ago' text
  function time_elapsed_string($datetime, $full = false) {
    // dsm($datetime);

    $now = new DrupalDateTime;
    $ago = new DrupalDateTime($datetime);

    // dsm($now);
    // dsm($ago);

    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'year',
        'm' => 'month',
        'w' => 'week',
        'd' => 'day',
        'h' => 'hour',
        'i' => 'minute',
        's' => 'second',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' ago' : 'just now';
  }

  private function getReactionCount($reactions_obj) {
    $reaction_count = (int)$reactions_obj['reactions_like']['summary']['total_count'] + (int)$reactions_obj['reactions_love']['summary']['total_count'] + (int)$reactions_obj['reactions_wow']['summary']['total_count'] + 
     (int)$reactions_obj['reactions_sad']['summary']['total_count'] + (int)$reactions_obj['reactions_angry']['summary']['total_count'] + (int)$reactions_obj['reactions_thankful']['summary']['total_count'];

    return $reaction_count;
  }
}