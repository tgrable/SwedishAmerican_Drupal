<?php

namespace Drupal\swedishamerican_accordion\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'SwedishAmerican Bootstrap Style Accordion.'
 *
 * @Block(
 *   id = "swedishamerican_accordion",
 *   admin_label = @Translation("SwedishAmerican Bootstrap Style Accordion"),
 * )
 */
class SwedishAmericanAccordion extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#markup' => $this->querySliderNodes(),
    );
  }

  private function querySliderNodes() {
    if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
      $nid = \Drupal::routeMatch()->getRawParameter('node');

      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('type', 'faq');
      $query->condition('field_page_reference', $nid);
      $entity_ids = $query->execute();

      $nodes = array();

      foreach($entity_ids as $id) {
        $node = \Drupal\node\Entity\Node::load($id);
        array_push($nodes, $node);
      }

      return $this->getNodeMarkup($nodes);
    }
  }

  private function getNodeMarkup($nodes) {
    $count = 1;
    $markup = '<!--Accordion wrapper-->';
    $markup .= '<div class="accordion" id="accordion" role="tablist" aria-multiselectable="true">';
      foreach ($nodes as $key => $node) {
        $question = $node->get('field_question')->getValue();
        $answer = $node->get('field_answer')->getValue();
        $markup .= '<div class="accordion-card">';
          $markup .= '<div class="card-header" role="tab" id="heading' . $count . '">';
            $markup .= '<a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' . $count . '" aria-expanded="false" aria-controls="#collapse' . $count . '">';
              $markup .= '<h3 class="card-title">';
                $markup .= $question[0]['value'] . '<i class="fa fa-angle-down rotate-icon"></i>';
              $markup .= '</h3>';
            $markup .= '</a>';
          $markup .= '</div>';
          $markup .= '<div id="collapse' . $count . '" class="collapse" role="tabpanel" aria-labelledby="heading' . $count . '">';
            $markup .= '<div class="panel-body">';
              $markup .= $answer[0]['value'];
            $markup .= '</div>';
          $markup .= '</div>';
        $markup .= '</div>';
        $count++;
      }
    $markup .= '</div>';
    $markup .= '<!--/.Accordion wrapper-->';

    return $markup;
  }
}