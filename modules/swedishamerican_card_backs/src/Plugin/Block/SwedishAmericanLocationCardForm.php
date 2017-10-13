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
      '#locations' => $this->getLocations(),
      '#cities' => $this->getLocationTerms(),
      '#serviceNodes' => $this->getServiceNodes()
    ];
  }

  private function getLocations() {
    $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
    foreach ($tree as $value) {
        $locations[$value->tid] = $value->name;
    }
    
    return $locations;
  }

  private function getLocationTerms() {
    $location_cities = array();
    $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('Locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
    foreach ($tree as $value) {
        $term = taxonomy_term_load($value->tid);
        $city = $term->get('field_city')->getValue();
        if (count($city) > 0) {
            $location_cities[$city[0]['value']] = $city[0]['value'];
        }
    }
    asort($location_cities);

    return $location_cities;
}

  private function getServiceNodes() {
    $query = \Drupal::entityQuery('node');
    $query->condition('status', 1);
    $query->condition('type', 'service');
    $query->sort('title', 'ASC');
    $entity_ids = $query->execute();

    $nodes = array();
    foreach($entity_ids as $id) {
        $node = \Drupal\node\Entity\Node::load($id);
        $nodes[$node->id()] = $node->getTitle();
    }
    return $nodes;
}

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}