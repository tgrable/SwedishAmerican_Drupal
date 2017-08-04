<?php

namespace Drupal\swedishamerican_providers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Providers' Block.
 *
 * @Block(
 *   id = "swedishamerican_providers",
 *   admin_label = @Translation("SwedishAmerican Providers"),
 * )
 */
class Providers extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()->getForm('Drupal\swedishamerican_providers\Form\ProvidersForm');
    return $form;
  }
}