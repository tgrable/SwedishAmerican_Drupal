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

      $array_keys = array_keys($entity_ids);
      $first_key = $array_keys[0];
      $nid = $entity_ids[$first_key];
      $node = \Drupal\node\Entity\Node::load($nid);

      return $this->getNodeMarkup($node);
    }
  }

  private function getNodeMarkup($node) {
    $documents = $node->get('field_documents')->getValue();
    $markup = '<div class="related-documents">';
    if (count($documents) > 0) {
      $markup .= '<h2>Documents</h2>';
      $markup .= '<ul>';
    }
    else {
      $markup .= '<div>';
    }
    foreach ($documents as $document) {
      $file = \Drupal\file\Entity\File::load($document['target_id']);
      $filename = strlen( $document['description'] ) > 0 ? $document['description'] : $file->getFilename();
      $markup .= '<li><a href="' . $file->url() . '" target="_blank">' . $filename . '</a></li>';
    }
    if (count($documents) > 0) {
      $markup .= '<ul>';
    }
    $markup .= '</div>';

    return $markup;
  }
}