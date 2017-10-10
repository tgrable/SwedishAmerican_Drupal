<?php

namespace Drupal\swedishamerican_locations\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Locations List.'
 *
 * @Block(
 *   id = "swedishamerican_locations",
 *   admin_label = @Translation("SwedishAmerican Locations List"),
 * )
 */
class SwedishAmericanLocationsList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()->getForm('Drupal\swedishamerican_locations\Form\LocationsForm');
    return $form;
  }  
}