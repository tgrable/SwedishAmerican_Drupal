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
      
      return $this->cleanLinks($links);
    }
  }

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }

  private function cleanLinks($links) {
    $cleanedLinks = array();
    foreach ($links as $link) {
      if (stripos($link['uri'], "internal:/") !== FALSE) {
        $link['uri'] = str_replace("internal:/", (isset($_SERVER['HTTPS']) ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . "/", $link['uri']);
        array_push($cleanedLinks, $link); 
      }
      if (stripos($link['uri'], "entity:") !== FALSE) {
        $link['uri'] = str_replace("entity:", (isset($_SERVER['HTTPS']) ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . "/", $link['uri']);
        array_push($cleanedLinks, $link); 
      }
      else {
        array_push($cleanedLinks, $link);
      }
    }
    
    return $cleanedLinks;
  }
}