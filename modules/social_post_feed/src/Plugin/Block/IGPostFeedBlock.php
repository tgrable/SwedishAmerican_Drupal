<?php
/**
 * @file
 * Contains Drupal\social_post_feed\Plugin\Block\IGPostFeedBlock.
 */

namespace Drupal\social_post_feed\Plugin\Block;

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
        'library' => array('social_post_feed/social_post_feed'),
      ),
    );
  }

  private function get_instagram_data() {
    $json_link = "https://api.instagram.com/v1/users/self/media/recent/?access_token=502658962.9df0c1e.b1efd7d3fc8a45fca4145a9c225e1970";
    $json = file_get_contents($json_link);
    $obj = json_decode($json, true);

    // dsm($obj);
    $post_array = $obj['data'];
    $markup = '<hr />';
     $markup .= '<div class="med-padding"></div>';
    $markup .= '<div class="social-block">';
      $markup .= '<div class="header-title">';
        $markup .= '<div class="fa-social-background ig-blue inline">';
          $markup .= '<h5 class="fa fa-instagram">&nbsp;</h5>';
        $markup .= '</div>';
        $markup .= '<div class="inline">';
          $markup .= '<h3>Instagram</h3>';
        $markup .= '</div>';
      $markup .= '</div>';
      $markup .= '<div class="instagram-container">';
        for ($i = 0; $i < 8; $i++) {
            if (isset($post_array[$i])) {
              if ($i < 2) {
                $markup .= '<div class="ig_article ig-content inline">';
                  $markup .= '<div class="post_image"><img src="' . $post_array[$i]['images']['low_resolution']['url'] . '" /></div>';
              }
              else {
                $markup .= '<div class="small_ig_article small_ig-content inline">';
                  $markup .= '<div class="small_post_image inline"><img src="' . $post_array[$i]['images']['low_resolution']['url'] . '" /></div>';
              }
            }
          $markup .= '</div>';
      }
        $markup .= '</div>';
    $markup .= '</div>';
    $markup .= '<div class="med-padding"></div>';

    return $markup;
  }

 }