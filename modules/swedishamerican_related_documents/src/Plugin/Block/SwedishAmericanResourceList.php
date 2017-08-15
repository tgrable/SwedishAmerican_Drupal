<?php

namespace Drupal\swedishamerican_related_documents\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Cache\Cache;

/**
 * Provides a 'SwedishAmerican Resource List' Block.
 *
 * @Block(
 *   id = "swedishamerican_resource_list",
 *   admin_label = @Translation("SwedishAmerican Resource List"),
 * )
 */
class SwedishAmericanResourceList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'resource_list',
      '#links' => $this->queryNodes()
    ];
  }

  private function queryNodes() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
      $nid = \Drupal::routeMatch()->getRawParameter('node');

      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $group = $query->orConditionGroup()
        ->condition('type', 'page')
        ->condition('type', 'service');
      $query->condition($group);
      $query->condition('nid', $nid);
      $entity_ids = $query->execute();

      $array_keys = array_keys($entity_ids);
      $first_key = $array_keys[0];
      $nid = $entity_ids[$first_key];
      $node = \Drupal\node\Entity\Node::load($nid);

      $links = $node->get('field_link')->getValue();

      return $links;
    }
  }

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}