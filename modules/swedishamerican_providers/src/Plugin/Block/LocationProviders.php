<?php

namespace Drupal\swedishamerican_providers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Location Providers' Block.
 *
 * @Block(
 *   id = "swedishamerican_location_providers",
 *   admin_label = @Translation("Swedish American Location Providers"),
 * )
 */
class LocationProviders extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->queryProviderNodes()
    );
  }

  private function queryProviderNodes() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.taxonomy_term.canonical') {
      $term_id = \Drupal::routeMatch()->getRawParameter('taxonomy_term');
      $term = \Drupal\taxonomy\Entity\Term::load($term_id);
      
      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('type', 'provider');
      if (strcmp ($term->getVocabularyId(), 'locations') === 0) {
        $query->condition('field_searchable_location_refere', $term_id);
      }
      else if (strcmp ($term->getVocabularyId(), 'service') === 0) {
        $query->condition('field_service_reference', $term_id);
      }
      else {

      }
      $entity_ids = $query->execute();

      $nodes = array();

      foreach($entity_ids as $nid) {
        $node = \Drupal\node\Entity\Node::load($nid);
        array_push($nodes, $node);
      }

      return $this->getProviderNodeMarkup($nodes);
    }
  }

  private function getProviderNodeMarkup($nodes) {
    $markup = '<div class="providers-container">';

    foreach($nodes as $node) {
      $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/' . $node->id());

      $markup .= '<div class="lightBox inline">';
        $markup .= '<div class="card" data-tag="' . $alias . ' #node_' . $node->id() . '">';

        if ($node->get('field_swedes_provider')->getValue() != null) {
          $swedes_provider = $node->get('field_swedes_provider')->getValue();
          
          if ($swedes_provider[0]['value'] == 1) {
            $markup .= '<div class="card-provider-btn-icon"></div>';
            $swedes_provider_group = 'internal-provider';
            $swedes_provider_group_bkgrd = 'card-provider-bkgrd-group';
            $swedes_provider_group_btn = 'card-provider-btn-group';
          }
          else {
              $swedes_provider_group = 'external-provider';
              $swedes_provider_group_bkgrd = 'card-provider-bkgrd';
              $swedes_provider_group_btn = 'card-provider-btn';
          }
        }

        if ($node->get('field_display_as_new')->getValue() != null) {
          $swedes_provider = $node->get('field_display_as_new')->getValue();
          if ($swedes_provider[0]['value'] == 1) {
            $markup .= '<div class="new-provider"></div>';
          }
        }

        if ($node->get('field_image')->getValue() != null) {
          $markup .= '<div class="views-field-field-image">';
              $markup .= '<div class="field-content">';
                  $markup .= '<img src="' . file_create_url($node->field_image->entity->getFileUri()) . '" typeof="foaf:Image" class="img-responsive" data-tag="' . file_create_url($node->field_image->entity->getFileUri()) . '">';
              $markup .= '</div>';
          $markup .= '</div>';
        }

        $title = $node->get('title')->getValue();
        $specialty = '';    

        if ($node->get('field_specialty')->getValue() != null) {
          $sp = $node->get('field_specialty')->getValue();
          $term_specialty = \Drupal\taxonomy\Entity\Term::load($sp[0]['target_id']);
          $termSpecialtyNameArray = $term_specialty->get('name')->getValue();
          $specialty = $termSpecialtyNameArray[0]['value'];
        }

        $markup .= '<div class="' . $swedes_provider_group . '">';
          $markup .= '<div class="' .  $swedes_provider_group_bkgrd . '">';
              $markup .= '<div class="card-provider-title"><strong>' . $title[0]['value'] . '</strong></div>';
              $markup .= '<div class="card-provider-special ">' . $specialty . '</div>';
          $markup .= '</div>'; // Close card-provider-bkgrd-groupcard div
        $markup .= '</div>'; // Close swedes_provider_group div 
        $markup .= '<div class="' . $swedes_provider_group_btn . '">More Information <i class="fa fa-angle-right"></i></div>';
        $markup .= '</div>'; // Close card div
      $markup .= '</div>'; // Close lightbox div
    }

    $markup .= '</div>'; // Close providers-container

    return $markup;
  }
}