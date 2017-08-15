<?php

namespace Drupal\swedishamerican_slider\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Cache\Cache;

/**
 * Provides a 'SwedishAmerican Bootstrap Style Carousel.'
 *
 * @Block(
 *   id = "swedishamerican_slider",
 *   admin_label = @Translation("SwedishAmerican Bootstrap Style Carousel"),
 * )
 */
class SwedishAmericanSlider extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    return [
      '#theme' => 'bootstrap_slider',
      '#nodes' => $this->querySliderNodes(),
    ];
  }

  private function querySliderNodes() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
      $nid = \Drupal::routeMatch()->getRawParameter('node');

      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('type', 'slider_image');
      $entity_ids = $query->execute();

      $nodes = array();

      foreach($entity_ids as $id) {
        $node = \Drupal\node\Entity\Node::load($id);
        array_push($nodes, $node);
      }
      return $nodes;
    }
  }

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}