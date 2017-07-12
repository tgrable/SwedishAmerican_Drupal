<?php
/**
 * @file
 * Contains Drupal\social_post_feed\Plugin\Block\YTPostFeedBlock.
 */

namespace Drupal\social_post_feed\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Datetime\DrupalDateTime;

/**
 * Provides a 'YouTube Post Feed' Block.
 *
 * @Block(
 *   id = "youtube_post_feed",
 *   admin_label = @Translation("YouTube Post Feed"),
 * )
 */

 class YTPostFeedBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->get_youtube_data(),
      '#allowed_tags' => ['iframe','a','html', 'div', 'p', 'img', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'span', 'i'],
      '#attached' => array(
        'library' => array('social_post_feed/social_post_feed'),
      ),
    );
  }

  private function get_youtube_data() {
    $chanel_id = 'UCYVyV7C6pT21drfc8J_aTJg';
    $youtube_json = file_get_contents('https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=UCYVyV7C6pT21drfc8J_aTJg&key=AIzaSyB3QivZGRmjmzUXQAzX9NAdNNEj2oSQyzE');
    $youtube_obj = json_decode($youtube_json, true);
  
    $vid_array = $youtube_obj['items'];

    $markup = '<div class="med-padding"></div>';
    $markup .= '<div class="social-block">';
      $markup .= '<div class="header-title">';
        $markup .= '<div class="fa-social-background yt-red inline">';
          $markup .= '<i class="fa fa-youtube-play">&nbsp;</i>';
        $markup .= '</div>';
        $markup .= '<div class="inline">';
          $markup .= '<p class="social-hdr">youtube</p>';
        $markup .= '</div>';
      $markup .= '</div>';
      $markup .= '<div class="youtube-container">';
        for ($i = 0; $i < 1; $i++) {
          $vid_id = $vid_array[$i]['id']['videoId'];
          $vid_title = $vid_array[$i]['snippet']['title'];
          $markup .= '<div class="social-card youtube-content inline">';
            $markup .= '<iframe class="embed-responsive-item" src="//www.youtube.com/embed/' . $vid_id . '"></iframe>';
            $markup .= '<div class="title-container">';
              $markup .= '<a href="https://www.youtube.com/watch?v=' . $vid_id . '" target="_blank">' . $this->break_up_title_string($vid_title) . '</a>';
            $markup .= '</div>';
          $markup .= '</div>';
        }
        $markup .= '<div class="divider inline"></div>';
        $markup .= '</div>';
    $markup .= '</div>';
    $markup .= '<div class="med-padding"></div>';

    return $markup;
  }

  private function break_up_title_string($title) {
    $markup = $title;
    if (strpos($title, ':') !== false) {
        $new_title = explode(':', $title);
        $markup = $new_title[0] . ':<p class="subtitle">' . $new_title[1] . '</p>';
    }

    return $markup;
  }
 }

 // TODO: Look into making the videos an overlay using the image thumbnail instead of the iframe.