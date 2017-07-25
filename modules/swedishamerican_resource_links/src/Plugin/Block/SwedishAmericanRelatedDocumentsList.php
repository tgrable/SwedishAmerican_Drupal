<?php

namespace Drupal\swedishamerican_resource_links\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Related Documents List' Block.
 *
 * @Block(
 *   id = "swedishamerican_related_documents_list",
 *   admin_label = @Translation("Swedish American Related Documents List"),
 * )
 */
class SwedishAmericanRelatedDocumentsList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->queryNodes(),
    );
  }

  private function queryNodes() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
      $nid = \Drupal::routeMatch()->getRawParameter('node');
      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('type', 'page');
      $query->condition('nid', $nid);
      $entity_ids = $query->execute();

      $nodes = array();

      foreach($entity_ids as $nid) {
        $node = \Drupal\node\Entity\Node::load($nid);
        array_push($nodes, $node);
      }

      return $this->getNodeMarkup($nodes);
    }
  }

  private function getNodeMarkup($nodes) {
    if (count($nodes) > 0) {
      $markup = '<div class="service-events"><h2>Documents</h2>';
    }
    else {
      $markup = '<div>';
    }
    $markup .= '<ul>';
    foreach ($nodes as $node) {
      $documents = $node->get('field_documents')->getValue();
      foreach ($documents as $document) {
        $file = \Drupal\file\Entity\File::load($document['target_id']);
        $filename = strlen( $document['description'] ) > 0 ? $document['description'] : $file->getFilename();
        $markup .= '<li><a href="' . $file->url() . '" target="_blank">' . $filename . '</a></li>';
      }
    }
    $markup .= '<ul>';
    $markup .= '</div>';
    return $markup;
  }
}