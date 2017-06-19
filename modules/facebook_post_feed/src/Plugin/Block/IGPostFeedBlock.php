<?php
/**
 * @file
 * Contains Drupal\facebook_post_feed\Plugin\Block\IGPostFeedBlock.
 */

namespace Drupal\facebook_post_feed\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Datetime\DrupalDateTime;

/**
 * Provides a 'Instagram Post Feed' Block.
 *
 * @Block(
 *   id = "instagram_post_feed",
 *   admin_label = @Translation("Instagram Post Feed"),
 * )
 */

 class IGPostFeedBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->get_instagram_data(),
      '#attached' => array(
        'library' => array('facebook_post_feed/facebook_post_feed'),
      ),
    );
  }

  private function get_instagram_data() {
    $json_link = "https://api.instagram.com/v1/users/self/media/recent/?access_token=502658962.9df0c1e.b1efd7d3fc8a45fca4145a9c225e1970";
    $json = file_get_contents($json_link);
    $obj = json_decode($json, true);

    // dsm($obj);
    $post_array = $obj['data'];
    $markup = '<hr /><div class="row">';
    for ($i = 0; $i < 3; $i++) {
        $markup .= '<div class="col-md-4">';
            $markup .= '<div class="ig_article">';
                $markup .= '<div class="profile-data">';
                    $markup .= '<img src="' . $post_array[$i]['user']['profile_picture'] . '" />';
                    $markup .= '<a href="https://www.instagram.com/swedish_american/" target="_blank">' . $post_array[$i]['user']['username'] . '</a>';
                $markup .= '</div>';
                $markup .= '<div class="post_image"><img src="' . $post_array[$i]['images']['low_resolution']['url'] . '" /></div>';
                $markup .= '<div class="post_reactions"><div class="reactions inline">' . $post_array[$i]['likes']['count'] . ' Likes</div></div>' ;
                $markup .= '<div class="post-message"><strong>' . $post_array[$i]['user']['username'] . '</strong> ' . $post_array[$i]['caption']['text'] . '</div>';
            $markup .= '</div>';
        $markup .= '</div>';
    }
    $markup .= '</div>';
    return $markup;
  }

 }