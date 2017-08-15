<?php

namespace Drupal\swedishamerican_providers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Cache\Cache;

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

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}