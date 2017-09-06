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
use Drupal\Core\Url;
use Drupal\Core\Cache\Cache;

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

    # retrieve query param
    $providerSwedes = \Drupal::request()->query->get('swedes_provider');
    if ($providerSwedes == null) {
      $providerSwedes = 1;
    }

    $providerName = \Drupal::request()->query->get('name');
    $providerLocation = \Drupal::request()->query->get('location');
    $providerSpecialty = \Drupal::request()->query->get('specialty');
    $providerGender = \Drupal::request()->query->get('gender');

    $form['wrapper'] = array(
        '#prefix' => '<div id="dependant-fields-wrapper" class="providers-wrapper inline"><h1>Providers</h1>',
        '#suffix' => '<div class="markup-area inline">' . $this->_queryAndFilterProviderNodes($form_state) . '</div>' . $this->getFormFooterMarkup() . '</div>'
    );

    $form['wrapper']['sag'] = array(
        '#type' => 'checkbox',
        '#field_prefix' => $this->getCheckBoxMarkup(),
        '#default_value' => $providerSwedes
    );  

    $form['wrapper']['name'] = array (
      '#type' => 'textfield',
      '#placeholder' => 'Name',
      '#default_value' => $providerName
    );

    $form['wrapper']['location'] = array (
      '#type' => 'select',
      '#empty_option' => t('Location'),
      '#options' => $locations,
      '#default_value' => $providerLocation
    );

    $form['wrapper']['specialty'] = array (
      '#type' => 'select',
      '#empty_option' => t('Specialty'),
      '#options' => $specialty,
      '#default_value' => $providerSpecialty
    );

    $form['wrapper']['gender'] = array (
      '#type' => 'select',
      '#empty_option' => t('Gender'),
      '#options' => array('male' => 'Male', 'Female' => 'Female'),
      '#default_value' => $providerGender
    );

    $form['wrapper']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Apply'),
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
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $form['#cache'] = ['max-age' => 0];

    # retrieve query param
    $providerSwedes = \Drupal::request()->query->get('swedes_provider');
    $swedes_provider = $this->getSearchTerm($providerSwedes, $form_state->getValue('sag'));
    if ($swedes_provider == null) $swedes_provider = 0;

    $providerName = \Drupal::request()->query->get('name');
    $name = $this->getSearchTerm($providerName, $form_state->getValue('name'));

    $providerLocation = \Drupal::request()->query->get('location');
    $category = $this->getSearchTerm($providerLocation, $form_state->getValue('location'));

    $providerSpecialty = \Drupal::request()->query->get('specialty');
    $specialty = $this->getSearchTerm($providerSpecialty, $form_state->getValue('specialty'));

    $providerGender = \Drupal::request()->query->get('gender');
    $gender = $this->getSearchTerm($providerGender, $form_state->getValue('gender'));

    $option = [
        'query' => [
            'swedes_provider' => $swedes_provider,
            'name' => $name,
            'location' => $category,
            'specialty' => $specialty,
            'gender' => $gender
        ],
    ];

    $url = Url::fromUri('internal:/find-a-doctor', $option);
    $form_state->setRedirectUrl($url);
  }

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
    # retrieve query param
    $providerName = \Drupal::request()->query->get('name');
    if ($providerName != null) {
        $keyword = $providerName;
    }
    else {
        $keyword = $form_state->getValue('name');
    }

    $providerLocation = \Drupal::request()->query->get('location');
    if ($providerLocation != null) {
        $location = $providerLocation;
    }
    else {
        $location = $form_state->getValue('location');
    }

    $providerSpecialty = \Drupal::request()->query->get('specialty');
    if ($providerSpecialty != null) {
        $form_specialty = $providerSpecialty;
    }
    else {
        $form_specialty = $form_state->getValue('specialty');
    }

    $providerGender = \Drupal::request()->query->get('gender');
    if ($providerGender != null) {
        $gender = $providerGender;
    }
    else {
        $gender = $form_state->getValue('gender');
    }

    $groupState = \Drupal::request()->query->get('swedes_provider');
    if ($groupState == null) {
      $groupState = 1;
    }
    // $groupState = $this->getSearchTerm($providerSwedes, $form_state->getValue('sag'));

    $query = \Drupal::entityQuery('node');
    $query->condition('status', 1);
    $query->condition('type', 'provider');
    
    if ($groupState == 1) {
      $query->condition('field_provider_type', 'Swedes Provider');
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
    $query->sort('title', 'ASC');

    $entity_ids = $query->execute();

    $nodes = array();

    $markup = '<div class="providers-container">';
  
    if (count($entity_ids) > 0) {
      foreach($entity_ids as $nid) {
        $node = \Drupal\node\Entity\Node::load($nid);
        $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$nid);

        $markup .= '<div class="lightBox inline">';
          $markup .= '<div class="card-provider" data-tag="' . $alias . ' #node_' . $node->id() . '">';

          if ($node->get('field_provider_type')->getValue() != null) {
            $swedes_provider = $node->get('field_provider_type')->getValue();
            
            if ($swedes_provider[0]['value'] == 'Swedes Provider') {
              $markup .= '<div class="card-provider-btn-icon"></div>';
              $provider_image_container = "views-field-field-image";
              $provider_title = "card-provider-title";
              $swedes_provider_group = 'internal-provider';
              $swedes_provider_group_bkgrd = 'card-provider-bkgrd-group';
              $swedes_provider_group_btn = 'card-provider-btn-group';
            }
            else if ($swedes_provider[0]['value'] == 'UW Doctor') {
              $markup .= '<div class="card-provider-btn-uw-icon"></div>';
              $provider_image_container = "views-field-field-image-uw";
              $provider_title = "card-provider-title-uw";
              $swedes_provider_group = 'uw-provider';
              $swedes_provider_group_bkgrd = 'card-provider-bkgrd-uw';
              $swedes_provider_group_btn = 'card-provider-btn-uw';
            }
            else if ($swedes_provider[0]['value'] == 'Courtesy') {
              $provider_image_container = "views-field-field-image";
              $provider_title = "card-provider-title";
              $swedes_provider_group = 'external-provider';
              $swedes_provider_group_bkgrd = 'card-provider-bkgrd';
              $swedes_provider_group_btn = 'card-provider-btn';
            }
            else {
              $markup .= '<div class="card-provider-btn-icon"></div>';
              $provider_image_container = "views-field-field-image";
              $provider_title = "card-provider-title";
              $swedes_provider_group = 'internal-provider';
              $swedes_provider_group_bkgrd = 'card-provider-bkgrd-group';
              $swedes_provider_group_btn = 'card-provider-btn-group';
            }
          }
          else {
            $markup .= '<div class="card-provider-btn-icon"></div>';
            $provider_image_container = "views-field-field-image";
            $provider_title = "card-provider-title";
            $swedes_provider_group = 'internal-provider';
            $swedes_provider_group_bkgrd = 'card-provider-bkgrd-group';
            $swedes_provider_group_btn = 'card-provider-btn-group';
          }

          if ($node->get('field_display_as_new')->getValue() != null) {
            $swedes_provider = $node->get('field_display_as_new')->getValue();
            if ($swedes_provider[0]['value'] == 1) {
              $markup .= '<div class="new-provider"></div>';
            }
          }

          if ($node->get('field_image')->getValue() != null) {
            $markup .= '<div class="' . $provider_image_container . '">';
                $markup .= '<div class="field-content">';
                    $markup .= '<img src="' .file_create_url($node->field_image->entity->getFileUri()) . '" typeof="foaf:Image" class="img-responsive">';
                $markup .= '</div>';
            $markup .= '</div>';
          }

          $name = $node->get('field_provider_name')->getValue();
          $label = $node->get('title')->getValue();
          $title = (count($name) > 0) ? $name : $label;
          
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
                if (count($termAddressArray) > 0) {
                  $termmarkup .= $termAddressArray[0]['value'] . '<br />';
                }
                if (count($termCityArray) > 0) {
                  $termmarkup .= $termCityArray[0]['value'] . ', ' . $termStateArray[0]['value'] . ' ' . $termZipArray[0]['value'] . '<br />';
                }
                if (count($termPhoneArray) > 0) {
                  $termmarkup .= $termPhoneArray[0]['value'];
                }
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
                $markup .= '<div class="' . $provider_title . '"><strong>' . $title[0]['value'] . '</strong></div>';
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
        $markup .= '<img src="/themes/swedishamerican/images/ico-pinwheel.png" alt="" title="" />';
      $markup .= '</div>';
      $markup .= '<div class="text inline">';
        $markup .= '<h2>SwedishAmerican Medical Group Providers</h2>';
        $markup .= '<span>By selecting "SwedishAmerican Medical Group Providers," your search results will <strong>ONLY</strong> display providers directly employed by SwedishAmerican Medical Group, as opposed to providers who are independent or employed by another organization, but are members of our active medical staff with admitting privileges at SwedishAmerican Hospital.</span>';
      $markup .= '</div>';
    $markup .= '</div>';

    return $markup;
  }

  private function getNodeContent() {
    $markup = '<div property="schema:text" class="field field--name-body field--type-text-with-summary field--label-hidden field--item">';
      $markup .= '<h2>Need a great doctor or healthcare provider?</h2>';
      $markup .= '<p>We have hundreds of them all over northern Illinois. And we’re here to help connect you with the one that best fits you and your family.&nbsp;To get started simply search here to find providers by name, specialty, location and other options.</p>';
      $markup .= '<hr>';
      $markup .= '<p><strong>When you’ve found the provider&nbsp;you like, you can request your first appointment or a referral by calling or emailing:</strong></p>';
      $markup .= '<h2>(779) 696-7081 | <a href="mailto:healthconnect@swedishamerican.org">healthconnect@swedishamerican.org</a></h2>';
    $markup .= '</div>';

    return $markup;
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

  public function getCacheContexts() {
    //if you depends on \Drupal::routeMatch()
    //you must set context of this block with 'route' context tag.
    //Every new route this block will rebuild
    return Cache::mergeContexts(parent::getCacheContexts(), array('route'));
  }
}