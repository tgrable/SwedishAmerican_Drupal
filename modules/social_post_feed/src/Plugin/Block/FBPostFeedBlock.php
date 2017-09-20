<?php
/**
 * @file
 * Contains Drupal\social_post_feed\Plugin\Block\FBPostFeedBlock.
 */

namespace Drupal\social_post_feed\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Cache\Cache;

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
    return [
      '#theme' => 'fb_postfeed',
      '#cache' => array(
        'max-age' => 43200 // 12 Hours
      ), 
      '#objects' =>  $this->get_facebook_data()
    ];
  }

  private function get_facebook_data() {
    $json_link = "https://graph.facebook.com/swedishamericanrockford/posts?&access_token=107003763308767|4ac39aeb7ee5834f0866aaf8854f61ab&fields=created_time,message,full_picture,shares,likes&limit=3";
    $json = file_get_contents($json_link);

    $obj = json_decode($json, true);

    for($x = 0; $x < count($obj['data']); $x++) {
        // when it was posted
        $created_time = $obj['data'][$x]['created_time'];
        $converted_date_time = date( 'Y-m-d H:i:s', strtotime($created_time));
        $ago_value = $this->time_elapsed_string($converted_date_time);
        $obj['data'][$x]['ago_value'] = $ago_value;
    }

    return $obj['data'];
  }

  // to get 'time ago' text
  function time_elapsed_string($datetime, $full = false) {
    $now = new DrupalDateTime;
    $ago = new DrupalDateTime($datetime);

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
}