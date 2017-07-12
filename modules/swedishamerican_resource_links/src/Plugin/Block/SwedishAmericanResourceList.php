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
    if (\Drupal::routeMatch()->getRouteName() == 'entity.taxonomy_term.canonical') {
      $term_id = \Drupal::routeMatch()->getRawParameter('taxonomy_term');
      $query = \Drupal::entityQuery('taxonomy_term');
      $query->condition('vid', 'resources');
      $query->condition('field_service_reference', $term_id);
      $entity_ids = $query->execute();

      $terms = array();

      foreach($entity_ids as $tid) {
        $term = \Drupal\taxonomy\Entity\Term::load($tid);
        $terms[$tid] = $term;
      }

      return $this->getResourceTermMarkup($terms);
    }
  }

  private function getResourceTermMarkup($terms) {
    $markup = '<div class="resources-list"><h2>Resources</h2>';
    $markup .= '<ul>';
      foreach ($terms as $key => $value) {
        $url = $value->get('field_resource_link')->getValue();
        $li = '<li><a href="' . $url[0]['uri'] . '" target="_blank">' . $value->getName() .  '</a></li>';
        $markup .= $li;
      }
    $markup .= '</ul></div>';

    return $markup;
  }
}