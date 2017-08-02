<?php

namespace Drupal\swedishamerican_eventslist\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Events List.'
 *
 * @Block(
 *   id = "swedishamerican_eventslist",
 *   admin_label = @Translation("SwedishAmerican Events List"),
 * )
 */
class SwedishAmericanEventsList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()->getForm('Drupal\swedishamerican_eventslist\Form\EventslistForm');
    return $form;
  }
  
}