<?php
/**
 * @file
 * Contains \Drupal\swedishamerican_locations\Form\LocationsForm.
 */
namespace Drupal\swedishamerican_locations\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

class LocationsForm extends FormBase {
    private $termTree;
    private $serviceNodes;
    private $locationTypes;

    /**
    * {@inheritdoc}
    */
    public function getFormId() {
        return 'swedishamerican_locations_form';
    }

    /**
    * {@inheritdoc}
    */
    public function buildForm(array $form, FormStateInterface $form_state) {
        $form['#cache'] = ['contexts' => ['url.query_args:location', 'url.query_args:city', 'url.query_args:service']];

        $this->serviceNodes = $this->getServiceNodes();
        $this->termTree = $this->getLocationTerms();
        $this->locationTypes = $this->getTaxonomyTerms('location_type');

        # retrieve query param
        $eventKeyword = \Drupal::request()->query->get('city');
        $locationTypeQuery = \Drupal::request()->query->get('service');


        $form['wrapper'] = array(
            '#prefix' => '<div id="location-form-wrapper" class="locations-wrapper inline">',
            '#suffix' => '<div class="markup-area">' . $this->_queryAndFilterLocationNodes($form_state) . '</div>'
        );

        $form['wrapper']['location'] = array (
            '#type' => 'select',
            '#empty_option' => t('Location'),
            '#options' => $this->getLocationNames()
        );

        $form['wrapper']['city'] = array (
            '#type' => 'select',
            '#empty_option' => t('City'),
            '#options' => $this->termTree,
            '#default_value' => $eventKeyword
        );

        $form['wrapper']['service'] = array (
            '#type' => 'select',
            '#empty_option' => t('Location Type'),
            '#options' => $this->locationTypes,
            '#default_value' => $locationTypeQuery
        );

        $form['wrapper']['submit'] = array(
            '#type' => 'submit',
            '#value' => $this->t('FIND'),
        );

        return $form;
    }

    /**
    * {@inheritdoc}
    */
    public function validateForm(array &$form, FormStateInterface $form_state) { }

    /**
    * {@inheritdoc}
    */
    public function submitForm(array &$form, FormStateInterface $form_state) {
        # retrieve query param
        $eventKeyword = \Drupal::request()->query->get('city');
        $keyword = $this->getSearchTerm($eventKeyword, $form_state->getValue('city'));

        $eventCategory = \Drupal::request()->query->get('service');
        $category = $this->getSearchTerm($eventCategory, $form_state->getValue('service'));

        $option = [
            'query' => [
                'location' => $location,
                'city' => $keyword,
                'service' => $category
            ],
        ];

        $url = Url::fromUri('internal:/' . $_SERVER['REQUEST_URI'], $option);
        $form_state->setRedirectUrl($url);
    }

    /**
    * Ajax callback to filter providers by state.
    */
    public function filterProvidersAjax(array &$form, FormStateInterface $form_state) { }

    /**
    * Helper function to query the print provider nodes
    */
    private function _queryAndFilterLocationNodes(FormStateInterface $form_state) {
        $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('Locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
        $terms = array();
        foreach ($tree as $value) {
            $term = taxonomy_term_load($value->tid);
            array_push($terms, $term);
        }

        # retrieve query param
        $cityKeyword = \Drupal::request()->query->get('city');
        $eventCategory = \Drupal::request()->query->get('service');
        $category = $this->getSearchTerm($eventCategory, $form_state->getValue('service'));

        if (isset($_REQUEST['city']) || isset($_REQUEST['service'])) {
            // param was set in the query string
            $filteredTerms = array();

            dsm("1");

            if(!empty($_REQUEST['city']) && !empty($_REQUEST['service'])) {
                dsm("1a");
                if (isset($this->locationTypes[$eventCategory])) {
                    dsm("1a-1");
                    $filteredTerms = $this->filterTerms($terms, 'city', $cityKeyword);
                    $filteredTerms = $this->filterTerms($filteredTerms, 'service', $eventCategory);
    
                    $locationString = (count($filteredTerms) != 1) ? 'Locations for ' : 'Location for ';
                    $searchString = $cityKeyword . ' and ' . $this->locationTypes[$eventCategory];
                    return $this->buildFilteredMarkup($filteredTerms, $locationString, $searchString);
                }
            }
            else if (empty($_REQUEST['city']) && empty($_REQUEST['service'])) {
                dsm("1b");
                return $this->buildFilteredMarkup($terms, '', '');
            }
            else {
                dsm("1c");
                $searchValue = '';
                $locationString = '';
                $filteredTerms = $terms;

                if(!empty($_REQUEST['city'])) {
                    dsm("1c-1");
                    $filteredTerms = $this->filterTerms($filteredTerms, 'city', $cityKeyword);
                    $locationString = (count($filteredTerms) != 1) ? 'Locations for ' : 'Location for ';
                    $searchValue .= (!empty($_REQUEST['service'])) ? $cityKeyword . ' and ' : $cityKeyword;
                }

                if(!empty($_REQUEST['service'])) {
                    dsm("1c-2");
                    if (isset($this->locationTypes[$eventCategory])) {
                        $filteredTerms = $this->filterTerms($filteredTerms, 'service', $eventCategory);
                        $locationString = (count($filteredTerms) != 1) ? 'Locations for ' : 'Location for ';
                        $searchValue .= $this->locationTypes[$eventCategory];
                    }
                }

                return $this->buildFilteredMarkup($filteredTerms, $locationString, $searchValue);
            }
        }
        else {
            dsm("2");
            return $this->buildDefaultMarkup($tree);
        }
    }

    private function buildDefaultMarkup($tree) {
        $count = 0;
        $markup = '<div class="emerengcy-container inline">';
            $markup .= '<div class="emerengcy-container-header">If you need emergency or immediate care</div>';
            $markup .= '<div class="emerengcy-container-inner">';
                foreach ($tree as $value) {
                    $term = taxonomy_term_load($value->tid);
                    if ($count < 4) {
                        $markup .= '<div class="emerengcy-container-location inline-desktop">';
                            $markup .= '<div class="image-container inline">';
                                $term_image = $term->get('field_image')->getValue();
                                if (count($term_image) > 0) {
                                    $markup .= '<img src="' . file_create_url($term->field_image->entity->getFileUri()) . '" alt="' . $term_image[0]['alt'] . '" />';
                                }
                                
                                $markup .= '<div class="emerengcy-container-links">';
                                $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/taxonomy/term/'.$term->id());
                                $markup .= '<a href="' . $alias . '" class="btn btn-info inline">INFO</a>';

                                $term_address = $term->get('field_address')->getValue();
                                $term_city = $term->get('field_city')->getValue();
                                $term_state = $term->get('field_state')->getValue();
                                $term_zip = $term->get('field_zip')->getValue();
                                $address = (count($term_address) > 0) ? $term_address[0]['value'] : '';
                                $city = (count($term_city) > 0) ? $term_city[0]['value'] . ', ' : '';
                                $state = (count($term_state) > 0) ? $term_state[0]['value'] : '';
                                $zip = (count($term_zip) > 0) ? $term_zip[0]['value'] : '';

                                $googleMapsString = 'https://www.google.com/maps/place/' . $address . '+' . $city  . '+' . $state . '+' . $zip;
                                $markup .= '<a href="' . $googleMapsString . '" class="btn btn-directions inline" target="_blank">Directions</a>';
                                $markup .= '</div>';
                            $markup .= '</div>';

                            $markup .= '<div class="emerengcy-container-details inline">';
                                $markup .= '<div class="emerengcy-container-name">';
                                    $term_name = $term->get('name')->getValue();
                                    $markup .= $term_name[0]['value'] . '<br />';
                                $markup .= '</div>';

                                $markup .= '<div class="emerengcy-container-address">';

                                    $markup .= $address . '<br />';
                                    $markup .= $city . $state . ' ' . $zip . '<br />';

                                    $term_phone = $term->get('field_phone')->getValue();
                                    $markup .= $term_phone[0]['value'];

                                $markup .= '</div>';

                                $markup .= '<div class="emerengcy-container-hours">';
                                    $markup .= '<span class="hours-header">Hours:</span>';
                                    $term_hours = $term->get('field_hours')->getValue();
                                    if ($term_hours > 0) {
                                        foreach ($term_hours as $hour) {
                                            $markup .= $hour['value'] . '<br />';
                                        }
                                    }
                                $markup .= '</div>';
                            $markup .= '</div>';

                        $markup .= '</div>';
                    }
                    $count++;
                }
            $markup .= '</div>';
        $markup .= '</div>';
        return $markup;
    }

    private function buildFilteredMarkup($filteredTerms, $serachType, $searchValue) {
        $markup = '<div class="divider-container"><hr /></div>';
        $markup .= '<div class="filtered-location-container">';
            $markup .= '<div class="results-container">RESULTS: ' . count($filteredTerms) . ' ' . $serachType . $searchValue;
            $markup .= '<div class="filtered-location-inner">';
                foreach ($filteredTerms as $term) {
                    $markup .= '<div class="filtered-location-card inline">';
                        $markup .= '<div class="filtered-location-details-container inline">';
                            $markup .= '<div class="filtered-location-name">';
                                $term_name = $term->get('name')->getValue();
                                $markup .= $term_name[0]['value'] . '<br />';
                                $markup .= '<hr />';
                            $markup .= '</div>';

                            $markup .= '<div class="filtered-container-address">';
                                $term_address = $term->get('field_address')->getValue();
                                $markup .= $term_address[0]['value'] . '<br />';

                                $term_city = $term->get('field_city')->getValue();
                                $term_state = $term->get('field_state')->getValue();
                                $term_zip = $term->get('field_zip')->getValue();
                                $city = ($term_city > 0) ? $term_city[0]['value'] . ', ' : '';
                                $state = ($term_state > 0) ? $term_state[0]['value'] : '';
                                $zip = ($term_zip > 0) ? $term_zip[0]['value'] : '';
                                $markup .= $city . $state . ' ' . $zip . '<br />';

                                $term_phone = $term->get('field_phone')->getValue();
                                $markup .= $term_phone[0]['value'];

                                $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/taxonomy/term/'.$term->id());
                                $markup .= '<br /><a href="' . $alias . '" class="btn btn-info inline">Location Info</a>';

                            $markup .= '</div>';

                        $markup .= '</div>';
                        
                        $markup .= '<div class="filtered-location-image-container inline">';
                            $term_image = $term->get('field_image')->getValue();
                            if (count($term_image) > 0) {
                                $markup .= '<div class="location-image" data-location="' . file_create_url($term->field_image->entity->getFileUri()) . '">&nbsp;</div>';
                            }
                        $markup .= '</div>';
                    $markup .= '</div>';
                }
            $markup .= '</div>';
        $markup .= '</div>';

        return $markup;
    }

    private function getLocationTerms() {
        $location_cities = array();
        $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('Locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
        foreach ($tree as $value) {
            $term = taxonomy_term_load($value->tid);
            $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/taxonomy/term/'.$term->id());
            
            $city = $term->get('field_city')->getValue();
            if (count($city) > 0) {
                $location_cities[$city[0]['value']] = $city[0]['value'];
            }
        }
        asort($location_cities);

        return $location_cities;
    }

    private function getLocationNames() {
        $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('Locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
        $terms = array();
        foreach ($tree as $value) {
            $term = taxonomy_term_load($value->tid);
            $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/taxonomy/term/'.$term->id());
            $name = $term->get('name')->getValue();
            if (count($term) > 0) {
                $terms[$alias] = $name[0]['value'];
            }
        }

        return $terms;
    }

    private function getTaxonomyTerms($taxonomy) {
        $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($taxonomy, $parent = 0, $max_depth = 1, $load_entities = FALSE);
        $terms = array();
        foreach ($tree as $value) {
            $term = taxonomy_term_load($value->tid);
            $name = $term->get('name')->getValue();
            if (count($term) > 0) {
                if ($taxonomy == 'location_type') {
                    $terms[$value->tid] = $name[0]['value'];
                }
                else {
                    $terms[$name[0]['value']] = $name[0]['value'];
                }
            }
        }

        return $terms;
    }

    private function getServiceNodes() {
        $query = \Drupal::entityQuery('node');
        $query->condition('status', 1);
        $query->condition('type', 'service');
        $query->sort('title', 'ASC');
        $entity_ids = $query->execute();

        $nodes = array();
        foreach($entity_ids as $id) {
            $node = \Drupal\node\Entity\Node::load($id);
            $nodes[$node->id()] = $node->getTitle();
        }
        return $nodes;
    }

    private function filterTerms($terms, $filerType, $checkValue) {
        $filteredTerms = array();
        foreach ($terms as $term) {
            $check_array = array();
            $check_field = '';
            if ($filerType == 'location') {
                $check_array = $term->get('name')->getValue();
                $subscriptValue = 'value';
            }
            else if ($filerType == 'city') {
                $check_array = $term->get('field_city')->getValue();
                $subscriptValue = 'value';
            }
            else {
                $check_array = $term->get('field_location_type')->getValue();
                $subscriptValue = 'target_id';
            }

            if (count($check_array) > 0) {
                for($i = 0; $i < count($check_array); $i++) {
                    $itemValue = $check_array[$i][$subscriptValue];
                    if ($itemValue == $checkValue) {
                        array_push($filteredTerms, $term);
                    }
                }
            }
        }

        return $filteredTerms;
    }

    private function getSearchTerm($queryString, $formValue) {
        if ($queryString != null) {
            if ($formValue == null) {
                $keyword = '';
            }
            else {
                if ($formValue == $queryString) {
                    $keyword = $queryString;
                }
                else {
                    $keyword = $formValue;
                }
            }
        }
        else {
            $keyword = $formValue;
        }

        return $keyword;
    }
}