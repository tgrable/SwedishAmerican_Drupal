<?php

namespace Drupal\swedishamerican_animation_banner\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'SwedishAmerican Animation Banner'
 *
 * @Block(
 *   id = "swedishamerican_animation_banner",
 *   admin_label = @Translation("SwedishAmerican Animation Banner"),
 * )
 */
class MainBanner extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'main_banner',
      '#nodes' => null,
      '#attached' => array(
        'library' => array('swedishamerican_animation_banner/swedishamerican-animation-banner'),
        ),
    ];
  }
}