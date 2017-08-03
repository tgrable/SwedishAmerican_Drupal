<?php

namespace Drupal\swedishamerican_slider\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Bootstrap Style Carousel.'
 *
 * @Block(
 *   id = "swedishamerican_slider",
 *   admin_label = @Translation("Swedish American Bootstrap Style Carousel"),
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
}