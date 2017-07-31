<?php

namespace Drupal\swedishamerican_resource_links\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Resources List' Block.
 *
 * @Block(
 *   id = "swedishamerican_resource_list",
 *   admin_label = @Translation("Swedish American Resources List"),
 * )
 */
class SwedishAmericanResourceList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->getTaxonomyTree(),
    );
  }

  private function getTaxonomyTree() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
      $nid = \Drupal::routeMatch()->getRawParameter('node');

      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('type', 'provider');
      $query->condition('field_service_reference_node', $nid);
      $entity_ids = $query->execute();

      $nodes = array();

      foreach($entity_ids as $id) {
        $node = \Drupal\node\Entity\Node::load($id);
        array_push($nodes, $node);
      }

      return $this->getNodeMarkup($nodes);
    }
  }

  private function getResourceTermMarkup($terms) {
    if (count($terms) > 0) {
      $markup = '<div class="resources-list"><h2>Resources</h2>';
      $markup .= '<ul>';
    }
    else {
      $markup = '<div>';
    }
  
    foreach ($terms as $key => $value) {
      $url = $value->get('field_resource_link')->getValue();
      $li = '<li><a href="' . $url[0]['uri'] . '" target="_blank">' . $value->getName() .  '</a></li>';
      $markup .= $li;
    }

    if (count($terms) > 0) {
      $markup .= '</ul></div>';
    }
    else {
      $markup = '<div>';
    }
    
    return $markup;
  }
}