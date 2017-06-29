<?php

namespace Drupal\swedishamerican_providers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Providers' Block.
 *
 * @Block(
 *   id = "swedishamerican_providers",
 *   admin_label = @Translation("Swedish American Providers"),
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