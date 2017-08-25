<?php

namespace Drupal\swedishamerican_card_backs\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;

/**
 * Provides a 'SwedishAmerican Card Back Location'
 *
 * @Block(
 *   id = "swedishamerican_card_backs_location",
 *   admin_label = @Translation("SwedishAmerican Card Back Location"),
 * )
 */
class SwedishAmericanLocationCardForm extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'location_form',
    ];
  }

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}