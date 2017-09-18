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
    // return array(
    //   '#markup' => $this->get_instagram_data(),
    //   '#allowed_tags' => ['iframe','a','html', 'div', 'p', 'img', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'span', 'i'],
    //   '#attached' => array(
    //     'library' => array('social_post_feed/social_post_feed'),
    //   ),
    // );

    return [
      '#theme' => 'ig_postfeed',
      '#cache' => ['max-age' => 86400], // 24 Hours
      '#nodes' =>  $this->get_instagram_data()
    ];
  }

  private function get_instagram_data() {
    $json_link = "https://api.instagram.com/v1/users/self/media/recent/?access_token=2108982472.108b657.e0675c3bca834f02910e0361a3bc8353";
    $json = file_get_contents($json_link);
    $obj = json_decode($json, true);

    $post_array = $obj['data'];

    return $post_array;
  }
}