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
      '#locations' => $this->getLocations()
    ];
  }

  private function getLocations() {
    $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
    foreach ($tree as $value) {
        $locations[$value->tid] = $value->name;
    }
    
    return $locations;
  }

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}