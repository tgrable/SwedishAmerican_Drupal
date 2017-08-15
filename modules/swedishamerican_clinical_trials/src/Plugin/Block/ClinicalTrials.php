<?php

namespace Drupal\swedishamerican_clinical_trials\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Providers' Block.
 *
 * @Block(
 *   id = "swedishamerican_clinical_trials",
 *   admin_label = @Translation("SwedishAmerican Clinical Trials"),
 * )
 */
class ClinicalTrials extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()->getForm('Drupal\swedishamerican_clinical_trials\Form\ClinicalTrialsForm');
    return $form;
  }
}