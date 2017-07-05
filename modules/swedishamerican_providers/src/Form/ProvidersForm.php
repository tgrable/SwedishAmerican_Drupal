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

    $form['wrapper'] = array(
        '#prefix' => '<div id="dependant-fields-wrapper" class="inline"><h1>Providers</h1>',
        '#suffix' => '<div class="markup-area inline">' . $this->_queryAndFilterProviderNodes($form_state) . '</div></div>'
    );

    $form['wrapper']['sag'] = array(
        '#type' => 'checkbox',
        '#title' => '',
        '#ajax' => [
          'callback' => array($this, 'filterProvidersAjax'),
          'event' => 'change',
        ],
    );  

    $form['wrapper']['name'] = array (
      '#type' => 'textfield',
      '#placeholder' => 'Name, Keyword',
      '#ajax' => [
        'callback' => array($this, 'filterProvidersAjax'),
        'event' => 'change',
      ],
    );

    $form['wrapper']['location'] = array (
      '#type' => 'select',
      '#empty_option' => t('Location'),
      '#options' => $locations,
      '#ajax' => [
        'callback' => array($this, 'filterProvidersAjax'),
        'event' => 'change',
      ],
    );

    $form['wrapper']['specialty'] = array (
      '#type' => 'select',
      '#empty_option' => t('Specialty'),
      '#options' => $specialty,
      '#ajax' => [
        'callback' => array($this, 'filterProvidersAjax'),
        'event' => 'change',
      ],
    );

    $form['wrapper']['gender'] = array (
      '#type' => 'select',
      '#empty_option' => t('Gender'),
      '#options' => array('male' => 'Male', 'Female' => 'Female'),
      '#ajax' => [
        'callback' => array($this, 'filterProvidersAjax'),
        'event' => 'change',
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
    $selection = $form_state->getValue('sag') == NULL ? '- I Hate Justin -' : 'state';
    
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
        ->condition('field_specialty', $keyword, 'CONTAINS')
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
    foreach($entity_ids as $nid) {
      $node = \Drupal\node\Entity\Node::load($nid);
      $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$nid);

      $markup .= '<div class="card">';

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

      if ($node->get('field_specialty')->getValue() != null) {
        $sp = $node->get('field_specialty')->getValue();
        $term_specialty = \Drupal\taxonomy\Entity\Term::load($sp[0]['target_id']);
        $termSpecialtyNameArray = $term_specialty->get('name')->getValue();
        $specialty = $termSpecialtyNameArray[0]['value'];
        // dsm($termSpecialtyNameArray);
      }

      $markup .= '<div class="' . $swedes_provider_group . '">';
        $markup .= '<div class="' .  $swedes_provider_group_bkgrd . '">';
            $markup .= '<div class="card-provider-title"><strong>' . $title[0]['value'] . '</strong></div>';
            $markup .= '<div class="card-provider-special ">' . $specialty . '</div>';
            $markup .= $termmarkup;
        $markup .= '</div>'; // Close card-provider-bkgrd-groupcard div
      $markup .= '</div>'; // Close swedes_provider_group div 
      $markup .= '<div class="' . $swedes_provider_group_btn . '"><a href="' . $alias . '">More Information <i class="fa fa-angle-right"></i></a></div>';
      $markup .= '</div>'; // Close card div
    }

    $markup .= '</div>';

    return $markup;
  }
}


/*
    {% if field_swedes_provider__value == 1 %}
<div class="internal-provider">
<div class="card-provider-bkgrd-group">
<div class="card-provider-title"><strong>{{ title }}</strong></div>
<div class="card-provider-special ">{{ field_speciality }}</div>
{{ field_location }}
</div>
<div class="card-provider-btn-group"><a href="{{ path }}">More Information <i class="fa fa-angle-right"></i></a></div>
</div>
{% else %}
<div class="external-provider">
    <div class="card-provider-bkgrd">
        <div class="card-provider-title"><strong>{{ title }}</strong></div>
        <div class="card-provider-special ">{{ field_speciality }}</div>
    {{ field_location }}
    </div>
    <div class="card-provider-btn"><a href="{{ path }}">More Information <i class="fa fa-angle-right"></i></a></div>
</div>
{% endif %}
*/