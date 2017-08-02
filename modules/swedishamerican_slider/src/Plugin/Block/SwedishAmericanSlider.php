<?php

namespace Drupal\swedishamerican_slider\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Swedish American Bootstrap Style Carousel.'
 *
 * @Block(
 *   id = "swedishamerican_slider",
 *   admin_label = @Translation("Swedish American Bootstrap Style Carousel"),
 * )
 */
class SwedishAmericanSlider extends BlockBase {

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
      $query->condition('type', 'slider_image');
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
    $markup = '<div id="myCarousel" class="carousel slide" data-ride="carousel">';

      $markup .= '<!-- Indicators -->';
      $markup .= '<ol class="carousel-indicators">';
        for ($i = 0; $i < count($nodes); $i++) {
          $class = ($i == 0) ? 'active' : '';
          $markup .= '<li data-target="#myCarousel" data-slide-to="' . $i . '" class=" ' . $class . '"></li>';
        }
      $markup .= '</ol>';

      $markup .= '<!-- Wrapper for slides -->';
      $markup .= '<div class="carousel-inner">';
        for ($j = 0; $j < count($nodes); $j++) {
          if ($nodes[$j]->get('field_image')->getValue() != null) {
            $class = ($j == 0) ? 'active' : '';
            $markup .= '<div class="item ' . $class .'">';
              $markup .= '<img src="' .file_create_url($nodes[$j]->field_image->entity->getFileUri()) . '" />';
            $markup .= '</div>';
          }
        }
      $markup .= '</div>';

      $markup .= '<!-- Left and right controls -->';
        $markup .= '<a class="left carousel-control" href="#myCarousel" data-slide="prev">';
          $markup .= '<span class="glyphicon glyphicon-chevron-left"></span>';
          $markup .= '<span class="sr-only">Previous</span>';
        $markup .= '</a>';
        $markup .= '<a class="right carousel-control" href="#myCarousel" data-slide="next">';
          $markup .= '<span class="glyphicon glyphicon-chevron-right"></span>';
          $markup .= '<span class="sr-only">Next</span>';
        $markup .= '</a>';

     $markup .= '</div>';

    return $markup;
  }
}