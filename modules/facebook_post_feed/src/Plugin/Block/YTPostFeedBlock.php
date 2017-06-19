<?php
/**
 * @file
 * Contains Drupal\facebook_post_feed\Plugin\Block\YTPostFeedBlock.
 */

namespace Drupal\facebook_post_feed\Plugin\Block;

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
      '#allowed_tags' => ['iframe','a','html', 'div', 'p', 'img', 'hr'],
      '#attached' => array(
        'library' => array('facebook_post_feed/facebook_post_feed'),
      ),
    );
  }

  private function get_youtube_data() {
    $chanel_id = 'UCYVyV7C6pT21drfc8J_aTJg';
    $youtube_json = file_get_contents('https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=UCYVyV7C6pT21drfc8J_aTJg&key=AIzaSyB3QivZGRmjmzUXQAzX9NAdNNEj2oSQyzE');
    $youtube_obj = json_decode($youtube_json, true);
  
    $vid_array = $youtube_obj['items'];

    $markup = '<hr /><div class="row">';
    for ($i = 0; $i < 3; $i++) {
      $vid_id = $vid_array[$i]['id']['videoId'];
      $vid_title = $vid_array[$i]['snippet']['title'];
      $markup .= '<div class="col-md-4">';
        $markup .= '<a href="#" target="_blank">' . $vid_title . '</a>';
        $markup .= '<iframe class="embed-responsive-item" src="//www.youtube.com/embed/' . $vid_id . '"></iframe>';
      $markup .= '</div>';
    }
    $markup .= '</div>';
    return $markup;
  }

 }