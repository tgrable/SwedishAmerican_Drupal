<?php

namespace Drupal\swedishamerican_card_backs\Plugin\Block;

use Drupal\Core\Block\BlockBase;

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
}