<?php

namespace Drupal\swedishamerican_resource_links\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Events List' Block.
 *
 * @Block(
 *   id = "swedishamerican_events_list",
 *   admin_label = @Translation("Swedish American Events List"),
 * )
 */
class SwedishAmericanEventsList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->queryEventNodes(),
    );
  }

  private function queryEventNodes() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.taxonomy_term.canonical') {
      $term_id = \Drupal::routeMatch()->getRawParameter('taxonomy_term');
      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('type', 'event');
      $query->condition('field_service_reference', $term_id);
      $entity_ids = $query->execute();

      $nodes = array();

      foreach($entity_ids as $nid) {
        $node = \Drupal\node\Entity\Node::load($nid);
        array_push($nodes, $node);
      }

      return $this->getEventNodeMarkup($nodes);
    }
  }

  private function getEventNodeMarkup($nodes) {
    $markup = '<div class="service-events"><h2>Events</h2>';
    foreach ($nodes as $node) {
      $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'. $node->id());
      $title = $node->get('title')->getValue();
      $markup .= '<a href="' . $alias . '">' . $title[0]['value'] . '</a>';

      if ($node->get('field_date')->getValue() != null) {
        $event_date = $node->get('field_date')->getValue();
        $markup .= '<p>';

        $dateMarkup = '';
        for ($i = 0; $i < count($event_date); $i++) {
          $date = \Drupal::service('date.formatter')->format(strtotime($event_date[$i]['value']), 'event_date_format');
          if ($i != count($event_date) - 1) {
            $dateMarkup .= $date . ', ';
          }
          else {
            $dateMarkup .= $date;
          }
        }
        $markup .= $dateMarkup;
        $markup .= '</p>';
      }

      $markup .= '<hr />';
    }
     $markup .= '</div>';
    return $markup;
  }
}