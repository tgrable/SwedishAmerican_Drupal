<?php
/**
 * @file
 * Contains \Drupal\swedishamerican_providers\Form\PrintProviderForm.
 */
namespace Drupal\swedishamerican_providers\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\paragraphs\Entity\Paragraph;

class ProvidersForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'swedishamerican_providers_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('locations', $parent = 0, $max_depth = 1, $load_entities = FALSE);
    foreach ($tree as $value) {
      $locations[$value->tid] = $value->name;
    }
    asort($locations);

    $specialty_tree = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('specialty', $parent = 0, $max_depth = 1, $load_entities = FALSE);
    foreach ($specialty_tree as $value) {
      $specialty[$value->tid] = $value->name;
    }
    asort($specialty);

    $fluid = "dependant-fields-wrapper-fluid";
    if (!\Drupal::currentUser()->isAnonymous()) {
      $fluid = "dependant-fields-wrapper-fluid-admin";
    }

    $form['wrapper'] = array(
        '#prefix' => '<div id="dependant-fields-wrapper" class="' . $fluid . ' inline"><h1>Providers</h1>',
        '#suffix' => '<div class="markup-area inline">' . $this->_queryAndFilterProviderNodes($form_state) . '</div>' . $this->getFormFooterMarkup() . '</div>'
    );

    $form['wrapper']['sag'] = array(
        '#type' => 'checkbox',
        '#field_prefix' => $this->getCheckBoxMarkup(),
    );  

    $form['wrapper']['name'] = array (
      '#type' => 'textfield',
      '#placeholder' => 'Name',
    );

    $form['wrapper']['location'] = array (
      '#type' => 'select',
      '#empty_option' => t('Location'),
      '#options' => $locations,
    );

    $form['wrapper']['specialty'] = array (
      '#type' => 'select',
      '#empty_option' => t('Specialty'),
      '#options' => $specialty,
    );

    $form['wrapper']['gender'] = array (
      '#type' => 'select',
      '#empty_option' => t('Gender'),
      '#options' => array('male' => 'Male', 'Female' => 'Female'),
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
    $message = $this->_queryAndFilterProviderNodes($form_state);
    $response->addCommand(new ReplaceCommand('.providers-container', $message));
    return $response;
  }

  /**
  * Helper function to query the print provider nodes
  */
  public function _queryAndFilterProviderNodes(FormStateInterface $form_state) {
    $groupState = $form_state->getValue('sag');
    $keyword = $form_state->getValue('name');
    $location = $form_state->getValue('location');
    $form_specialty = $form_state->getValue('specialty');
    $gender = $form_state->getValue('gender');

    $query = \Drupal::entityQuery('node');
    $query->condition('status', 1);
    $query->condition('type', 'provider');
    
    if ($groupState == 1) {
      $query->condition('field_swedes_provider', true);
    }
    
    if ($keyword != null) {
      $group = $query->orConditionGroup()
        // ->condition('field_specialty', $keyword, 'CONTAINS')
        ->condition('title', $keyword, 'CONTAINS');

      $query->condition($group);
    }
    
    if ($location != null) {
      // $query->condition('field_location.entity:paragraphs_type.field_location_reference', 1);
      $query->condition('field_searchable_location_refere', $location);
    }

    if ($form_specialty != null) {
      $query->condition('field_specialty', $form_specialty);
    }

    if ($gender != null) {
      $query->condition('field_gender', $gender);
    }

    $entity_ids = $query->execute();

    $nodes = array();

    $markup = '<div class="providers-container">';
    if (count($entity_ids) > 0) {
      foreach($entity_ids as $nid) {
        $node = \Drupal\node\Entity\Node::load($nid);
        $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$nid);

        $markup .= '<div class="lightBox inline">';
          $markup .= '<div class="card-provider" data-tag="' . $alias . ' #node_' . $node->id() . '">';

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
                    $markup .= '<img src="' .file_create_url($node->field_image->entity->getFileUri()) . '" typeof="foaf:Image" class="img-responsive">';
                $markup .= '</div>';
            $markup .= '</div>';
          }

          $title = $node->get('title')->getValue();
          $specialty = '';
          $termmarkup = '';

          if ($node->get('field_location')->getValue() != null) {
            $pid = $node->get('field_location')->getValue();
            $paragraph = Paragraph::load($pid[0]['target_id']);
            $tid = $paragraph->get('field_location_reference')->getValue();

            if (count($tid) > 0) {
              if ($term = \Drupal\taxonomy\Entity\Term::load($tid[0]['target_id'])) {
                $termNameArray = $term->get('name')->getValue();
                $termAddressArray = $term->get('field_address')->getValue();
                $termCityArray = $term->get('field_city')->getValue();
                $termStateArray = $term->get('field_state')->getValue();
                $termZipArray = $term->get('field_zip')->getValue();
                $termPhoneArray = $term->get('field_phone')->getValue();

                $termmarkup = '<div class="card-provider-location-name">';
                  $termmarkup .= $termNameArray[0]['value'];
                $termmarkup .= '</div>';
                $termmarkup .= '<div class="card-provider-location-info ">';
                $termmarkup .= $termAddressArray[0]['value'] . '<br />';
                $termmarkup .= $termCityArray[0]['value'] . ', ' . $termStateArray[0]['value'] . ' ' . $termZipArray[0]['value'] . '<br />';
                $termmarkup .= $termPhoneArray[0]['value'];
                $termmarkup .= '</div>';
              }
            }
          }      

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
                // $markup .= $termmarkup;
            $markup .= '</div>'; // Close card-provider-bkgrd-groupcard div
          $markup .= '</div>'; // Close swedes_provider_group div 
          $markup .= '<div class="' . $swedes_provider_group_btn . '">More Information <i class="fa fa-angle-right"></i></div>';
          $markup .= '</div>'; // Close card div
        $markup .= '</div>'; // Close lightBox div
      }
    }
    else {
      $markup .= '<div class="no-results-container"><h1>No Results Found</h1></div>';
    }

    $markup .= '</div>';

    return $markup;
  }

  private function getCheckBoxMarkup() {
    $markup = '<div class="sag-markup">';
      $markup .= '<div class="image inline">';
        $markup .= '<img src="/themes/swedishamerican/images/ico-pinwheel.png" />';
      $markup .= '</div>';
      $markup .= '<div class="text inline">';
        $markup .= '<span>Show <strong>ONLY</strong><br />SwedishAmerican Group Providers</span>';
      $markup .= '</div>';
    $markup .= '</div>';

    return $markup;
  }

  private function getFormFooterMarkup() {
    $markup = '<div class="dependant-fields-footer">';
      $markup .= '<div class="icon inline">';
        $markup .= '<i class="fa fa-warning"></i>';
      $markup .= '</div>';
      $markup .= '<div class="text inline">';
        $markup .= '<h2>SwedishAmerican Medical Group Providers</h2>';
        $markup .= '<span>By selecting "SwedishAmerican Group Providers," your search results will <strong>ONLY</strong> display providers directly employed by SwedishAmerican Medical Group, as opposed to providers who are independent or employed by another organization, but are members of our active medical staff with admitting privileges at SwedishAmerican Hospital.</span>';
      $markup .= '</div>';
    $markup .= '</div>';

    return $markup;
  }
}