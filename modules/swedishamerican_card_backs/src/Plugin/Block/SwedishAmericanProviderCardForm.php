<?php

namespace Drupal\swedishamerican_card_backs\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Cache\Cache;

/**
 * Provides a 'SwedishAmerican Card Back Provider' Block.
 *
 * @Block(
 *   id = "swedishamerican_card_backs_provider",
 *   admin_label = @Translation("SwedishAmerican Card Back Provider"),
 * )
 */
class SwedishAmericanProviderCardForm extends BlockBase {

    /**
    * {@inheritdoc}
    */
    public function build() {
        return [
            '#theme' => 'provider_form',
            '#locations' => $this->getLocations(),
            '#specialties' => $this->getSpecialties()
        ];
    }

    private function getLocations() {
        $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
        foreach ($tree as $value) {
            $locations[$value->tid] = $value->name;
        }
        asort($locations);

        return $locations;
    }

    private function getSpecialties() {
        $specialty_tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('specialty', $parent = 0, $max_depth = 1, $load_entities = FALSE);
        foreach ($specialty_tree as $value) {
          $specialty[$value->tid] = $value->name;
        }
        asort($specialty);

        return $specialty;
    }

    public function getCacheContexts() {
        //if you depends on \Drupal::routeMatch()
        //you must set context of this block with 'route' context tag.
        //Every new route this block will rebuild
        return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
      }
}