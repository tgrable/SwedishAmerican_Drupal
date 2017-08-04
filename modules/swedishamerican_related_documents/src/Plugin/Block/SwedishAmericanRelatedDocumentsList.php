<?php

namespace Drupal\swedishamerican_related_documents\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Related Documents List' Block.
 *
 * @Block(
 *   id = "swedishamerican_related_documents_list",
 *   admin_label = @Translation("SwedishAmerican Related Documents List"),
 * )
 */
class SwedishAmericanRelatedDocumentsList extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'related_documents',
      '#documents' => $this->queryNodes(),
      '#files' => $this->createFiles($this->queryNodes()),
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

      $documents = $node->get('field_documents')->getValue();

      return $documents;
    }
  }

  private function createFiles($documents) {
    $files = array();
    foreach ($documents as $document) {
      $file = \Drupal\file\Entity\File::load($document['target_id']);
      array_push($files, $file);
    }

    return $files;
  }
}