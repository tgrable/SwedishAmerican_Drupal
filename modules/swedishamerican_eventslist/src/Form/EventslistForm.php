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

        $form['wrapper'] = array(
            '#prefix' => '<div id="dependant-fields-wrapper" class="inline">',
            '#suffix' => '<div class="markup-area inline">' . $this->_queryAndFilterProviderNodes($form_state) . '</div>'
        );

        $form['wrapper']['name'] = array (
            '#type' => 'textfield',
            '#placeholder' => 'Keyword',
        );

        $form['wrapper']['service'] = array (
            '#type' => 'select',
            '#empty_option' => t('Service Category'),
            '#options' => $this->getSerciveNodes(),
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
        $form['result'] = 'I Hate Justin!';

        $form_state->setRebuild();
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
        // dsm($nodes);
        
        $markup = '<div class="events-container">';

            foreach ($nodes as $node) {
                $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$node->id());
                $markup .= '<div class="lightBox inline">';
                    $markup .= '<div class="card-event" data-tag="' . $alias . ' #node_' . $node->id() . '">';
                        $title = $node->get('title')->getValue();
                        $markup .= '<h2>' . $title[0]['value'] . '</h2>';

                        $dates = $node->get('field_date')->getValue();
                        $dateMarkup = '';
                        for ($i = 0; $i < count($dates); $i++) {
                            $date = \Drupal::service('date.formatter')->format(strtotime($dates[$i]['value']), 'event_date_format');
                            if ($i != count($dates) - 1) {
                                $dateMarkup .= $date . ', ';
                            }
                            else {
                                $dateMarkup .= $date;
                            }
                        }
                        $markup .= '<p>' . $dateMarkup . '</p>';

                        $body = $node->get('body')->getValue();
                        $markup .= '<p>' . $body[0]['summary'] . '</p>';

                    $markup .= '</div>';
                $markup .= '</div>';
            }
    
        $markup .= '</div>';
        
        return $markup;
    }

    private function getSerciveNodes() {
        if (\Drupal::routeMatch()->getRouteName() == 'entity.node.canonical') {
            $query = \Drupal::entityQuery('node');
            $query->condition('status', 1);
            $query->condition('type', 'service');
            $entity_ids = $query->execute();

            $nodes = node_load_multiple($entity_ids);

            $options = array();
            foreach($nodes as $node) {
                $title = $node->get('title')->getValue();
                $options[$node->id()] = $title[0]['value'];
            }

            return $options;
        }
    }
}