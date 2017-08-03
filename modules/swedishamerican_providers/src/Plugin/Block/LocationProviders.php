<?php

namespace Drupal\swedishamerican_providers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Location Providers' Block.
 *
 * @Block(
 *   id = "swedishamerican_location_providers",
 *   admin_label = @Translation("Swedish American Location Providers"),
 * )
 */
class LocationProviders extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'providers_feed',
      '#nodes' => $this->queryProviderNodes()
    ];
  }

  private function queryProviderNodes() {
    $id = 0;

    $query = \Drupal::entityQuery('node');
    $query->condition('status', 1);
    $query->condition('type', 'provider');
    
    if (\Drupal::routeMatch()->getRouteName() == 'entity.taxonomy_term.canonical') {
      $id = \Drupal::routeMatch()->getRawParameter('taxonomy_term');
      $query->condition('field_searchable_location_refere', $id);
    }
    else if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
      $id = \Drupal::routeMatch()->getRawParameter('node');
      $query->condition('field_service_reference_node', $id);
    }

    $entity_ids = $query->execute();

    $nodes = array();

    foreach($entity_ids as $nid) {
      $node = \Drupal\node\Entity\Node::load($nid);
      array_push($nodes, $node);
    }
    
    return $nodes;
  }
}