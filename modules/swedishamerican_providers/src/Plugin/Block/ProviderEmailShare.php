<?php

namespace Drupal\swedishamerican_providers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Provider Email Share' Block.
 *
 * @Block(
 *   id = "swedishamerican_provider_email_share",
 *   admin_label = @Translation("SwedishAmerican Provider Email Share"),
 * )
 */
class ProviderEmailShare extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()->getForm('Drupal\swedishamerican_providers\Form\ProviderEmailShareForm');
    return $form;
  }
}