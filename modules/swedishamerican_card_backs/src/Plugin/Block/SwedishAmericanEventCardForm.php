<?php

namespace Drupal\swedishamerican_card_backs\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;

/**
 * Provides a 'SwedishAmerican Card Back Event'
 *
 * @Block(
 *   id = "swedishamerican_card_backs_event",
 *   admin_label = @Translation("SwedishAmerican Card Back Event"),
 * )
 */
class SwedishAmericanEventCardForm extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'event_form',
      '#events' => $this->getEvents()
    ];
  }

  private function getEvents() {
    $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('events', $parent = 0, $max_depth = 1, $load_entities = FALSE);
    foreach ($tree as $value) {
        $events[$value->tid] = $value->name;
    }
    asort($events);

    return $events;
  }

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}