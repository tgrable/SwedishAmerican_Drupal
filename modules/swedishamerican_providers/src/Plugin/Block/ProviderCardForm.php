<?php

namespace Drupal\swedishamerican_providers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Cache\Cache;

/**
 * Provides a 'SwedishAmerican Providers Card Form' Block.
 *
 * @Block(
 *   id = "swedishamerican_providers_card_form",
 *   admin_label = @Translation("SwedishAmerican Providers Card Form"),
 * )
 */
class ProviderCardForm extends BlockBase {

    /**
    * {@inheritdoc}
    */
    public function build() {
        return [
            '#theme' => 'providers_card_form',
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