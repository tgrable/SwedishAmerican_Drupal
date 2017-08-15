<?php
/**
 * @file
 * Contains \Drupal\swedishamerican_clinical_trials\Form\ClinicalTrialsForm.
 */
namespace Drupal\swedishamerican_clinical_trials\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\paragraphs\Entity\Paragraph;

class ClinicalTrialsForm extends FormBase {
    /**
    * {@inheritdoc}
    */
    public function getFormId() {
        return 'swedishamerican_clinical_trials';
    }

    /**
    * {@inheritdoc}
    */
    public function buildForm(array $form, FormStateInterface $form_state) {
        $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('clinical_trials', $parent = 0, $max_depth = 1, $load_entities = FALSE);
        foreach ($tree as $value) {
            $locations[$value->tid] = $value->name;
        }
        asort($locations);

        $form['wrapper'] = array(
            '#prefix' => '<div class="inline">',
            '#suffix' => '<div class="markup-area inline">' . $this->_queryAndFilterTrialNodes($form_state) . '</div></div>'
        );

        $form['wrapper']['trials'] = array (
            '#type' => 'select',
            '#empty_option' => t('Clinical Trials'),
            '#options' => $locations,
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
    public function validateForm(array &$form, FormStateInterface $form_state) {}

    /**
    * {@inheritdoc}
    */
    public function submitForm(array &$form, FormStateInterface $form_state) {}

    /**
    * Ajax callback to filter providers by state.
    */
    public function filterProvidersAjax(array &$form, FormStateInterface $form_state) {
        $response = new AjaxResponse();   
        $message = $this->_queryAndFilterTrialNodes($form_state);
        $response->addCommand(new ReplaceCommand('.trials-container', $message));
        return $response;
    }

    /**
    * Helper function to query the print provider nodes
    */
    public function _queryAndFilterTrialNodes(FormStateInterface $form_state) {
        $trialType = $form_state->getValue('trials');

        $markup = '<div class="trials-container">';
        if ($trialType != null) {
            $query = \Drupal::entityQuery('node');
            $query->condition('status', 1);
            $query->condition('type', 'clinical_trial');
            $query->condition('field_clinical_trial_reference', $trialType);
            $entity_ids = $query->execute();
            $nodes = array();
        
            
            if (count($entity_ids) > 0) {
                foreach($entity_ids as $nid) {
                    $node = \Drupal\node\Entity\Node::load($nid);
                    $markup = '<div class="trial-container">';
                        if ($node->get('field_trial_id')->getValue() != null) {
                            $trialId = $node->get('field_trial_id')->getValue();
                            $markup .= '<div class="trial-id">' . $trialId[0]['value'] . ':</div>';
                        }
                        if ($node->get('body')->getValue() != null) {
                            $trialBody = $node->get('body')->getValue();
                            $markup .= '<div class="trial-body">' . $trialBody[0]['value'] . '</div>';
                        }
                    $markup .= '</div>'; 
                }
            }
        }
        $markup .= '</div>'; 
        
        return $markup;
    }

}