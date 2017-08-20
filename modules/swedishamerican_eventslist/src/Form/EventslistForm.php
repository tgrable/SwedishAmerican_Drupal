<?php
/**
 * @file
 * Contains \Drupal\swedishamerican_eventslist\Form\PrintProviderForm.
 */
namespace Drupal\swedishamerican_eventslist\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\paragraphs\Entity\Paragraph;

class EventslistForm extends FormBase {
    /**
    * {@inheritdoc}
    */
    public function getFormId() {
        return 'swedishamerican_eventslist_form';
    }

    /**
    * {@inheritdoc}
    */
    public function buildForm(array $form, FormStateInterface $form_state) {
        // $form['#theme'] = 'eventlist';

        $fluid = "events-dependant-fields-wrapper-fluid";
        if (!\Drupal::currentUser()->isAnonymous()) {
          $fluid = "events-dependant-fields-wrapper-fluid-admin";
        }

        $form['wrapper'] = array(
            '#prefix' => '<div id="dependant-fields-wrapper" class="' . $fluid . ' inline"><h1>Events</h1>',
            '#suffix' => '<div class="markup-area markup-sticky inline">' . $this->_queryAndFilterProviderNodes($form_state) . '</div>'
        );

        $form['wrapper']['name'] = array (
            '#type' => 'textfield',
            '#placeholder' => 'Keyword',
        );

        $form['wrapper']['service'] = array (
            '#type' => 'select',
            '#empty_option' => t('Event Category'),
            '#options' => $this->getEventCategoryNodes(),
        );

        $form['wrapper']['submit'] = array(
            '#type' => 'submit',
            '#value' => $this->t('Apply'),
            '#ajax' => [
                'wrapper' => 'wrapper',
                'callback' => array($this, 'filterProvidersAjax'),
            ],
        );

        return $form;
    }

    /**
    * {@inheritdoc}
    */
    public function validateForm(array &$form, FormStateInterface $form_state) {

    }

    /**
    * {@inheritdoc}
    */
    public function submitForm(array &$form, FormStateInterface $form_state) {
    }

    /**
    * Ajax callback to filter providers by state.
    */
    public function filterProvidersAjax(array &$form, FormStateInterface $form_state) {
        $response = new AjaxResponse();   
        $message = $this->_queryAndFilterProviderNodes($form_state);
        $response->addCommand(new ReplaceCommand('.events-container', $message));
        return $response;
    }

    /**
    * Helper function to query the print provider nodes
    */
    private function _queryAndFilterProviderNodes(FormStateInterface $form_state) {
        if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {

            $keyword = $form_state->getValue('name');
            $service = $form_state->getValue('service');
            $nid = \Drupal::routeMatch()->getRawParameter('node');

            $query = \Drupal::entityQuery('node');
            $query->condition('status', 1);
            $query->condition('type', 'event');
            if ($keyword != null) {
                $query->condition('title', $keyword, 'CONTAINS');
            }
            if ($service != null) {
                $query->condition('field_service_reference_node', $service);
            }
            $entity_ids = $query->execute();

            $nodes = array();

            foreach($entity_ids as $id) {
                $node = \Drupal\node\Entity\Node::load($id);
                array_push($nodes, $node);
            }

            return $this->_getNodeMarkup($nodes);
        }
    }
    
    /**
    * Helper function to build the node markup
    */
    private function _getNodeMarkup($nodes) {
        $markup = '<div class="events-container">';
            if (count($nodes) > 0) {
                foreach ($nodes as $node) {
                    $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$node->id());
                    $markup .= '<div class="lightBox inline">';
                        $markup .= '<div class="card-event" data-tag="' . $alias . ' #node_' . $node->id() . '">';
                            if (count($node->get('field_image')->getValue()) > 0) {
                                $markup .= '<div class="event-image" data-event="' . file_create_url($node->field_image->entity->getFileUri()) . '">&nbsp;</div>';
                            }
                            $markup .= '<div class="event-details">';
                                $title = $node->get('title')->getValue();
                                $markup .= '<h2>' . $title[0]['value'] . '</h2>';
                                $dates = $node->get('field_date_text')->getValue();
                                $dateMarkup = '';
                                for ($i = 0; $i < count($dates); $i++) {
                                    $dateMarkup .= '<p>' . $dates[$i]['value'] . '</p>';
                                }
                                $markup .= $dateMarkup;
                                $body = $node->get('body')->getValue();
                                $markup .= '<p>' . $body[0]['summary'] . '</p>';
                            $markup .= '</div>';
                        $markup .= '</div>';
                    $markup .= '</div>';
                }
            }
            else {
                $markup .= '<h1>No Results Found</h1>';
            }
        $markup .= '</div>';
        
        return $markup;
    }

    private function getEventCategoryNodes() {
        $event_categories = array();
        $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('events', $parent = 0, $max_depth = 1, $load_entities = FALSE);
        foreach ($tree as $value) {
            $event_categories[$value->tid] = $value->name;
        }
        asort($event_categories);

        return $event_categories;
    }
}