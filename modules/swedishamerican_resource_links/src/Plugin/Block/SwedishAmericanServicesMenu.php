<?php

namespace Drupal\swedishamerican_resource_links\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Services Menu' Block.
 *
 * @Block(
 *   id = "swedishamerican_services_menu",
 *   admin_label = @Translation("Swedish American Services Menu"),
 * )
 */
class SwedishAmericanServicesMenu extends BlockBase {

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
      $term = \Drupal\taxonomy\Entity\Term::load($term_id);
      $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($term->getVocabularyId(), $parent = $term_id, $max_depth = 1, $load_entities = FALSE);
      return $this->getTermMenuMarkup($term->getName(), $tree);
    }
  }

  private function getTermMenuMarkup($termName, $services) {
    $markup = '<div class="service-sub-nav"><h2>' . $termName . '</h2>';
    $markup .= '<ul>';
      foreach ($services as $value) {
        $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/taxonomy/term/'. $value->tid);
        $li = '<li><a href="' . $alias . '">' . $value->name .  '</a></li>';
        $markup .= $li;
      }
    $markup .= '</ul></div>';

    return $markup;
  }
}