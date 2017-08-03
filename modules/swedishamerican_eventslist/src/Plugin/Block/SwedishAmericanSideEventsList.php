<?php
// SwedishAmericanSideEventsList.php
namespace Drupal\swedishamerican_eventslist\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Events List Side Rail' Block.
 *
 * @Block(
 *   id = "swedishamerican_side_events_list",
 *   admin_label = @Translation("SwedishAmerican Events List Side Rail"),
 * )
 */
class SwedishAmericanSideEventsList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'eventslist',
      '#nodes' => $this->queryEventNodes(),
    ];
  }

  private function queryEventNodes() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
      $nid = \Drupal::routeMatch()->getRawParameter('node');

      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('type', 'event');
      $query->condition('field_service_reference_node', $nid);
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