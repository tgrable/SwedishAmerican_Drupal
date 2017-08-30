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

class ProviderEmailShareForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'swedishamerican_provider_email_share_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $nid = \Drupal::request()->query->get('id');
    $node = $this->_queryProvideNodes($nid);
    $title = $node->get('title')->getValue();

    $form['wrapper'] = array(
        '#prefix' => '<h2>Email ' . $title[0]['value'] . ' to a Friend</h2>'
    );

    $form['wrapper']['toField'] = array (
      '#type' => 'textfield',
      '#placeholder' => 'To:',
      '#default_value' => ''
    );

    $form['wrapper']['fromField'] = array (
      '#type' => 'textfield',
      '#placeholder' => 'From:',
      '#default_value' => ''
    );

    $form['submit_button'] = array(
      '#type' => 'submit',
      '#value' => t('Share'),
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
    $nidQueryString = $_SERVER["QUERY_STRING"];
  	$nid = explode("=", $nidQueryString);
    $node = $this->_queryProvideNodes($nid[1]);
    $title = $node->get('title')->getValue();

    $mailManager = \Drupal::service('plugin.manager.mail');
    $module = 'swedishamerican_providers';
    $key = 'swedishamerican_providers';
    $to = $form_state->getValue('toField');
    $params['message'] = 'Email Body';
    $params['subject'] = 'SwedishAmerican Provider';
    $params['from'] = $form_state->getValue('fromField');
    $langcode = \Drupal::currentUser()->getPreferredLangcode();
    $send = true;
    $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
    if ($result['result'] !== true) {
      drupal_set_message(t('There was a problem sending your message and it was not sent.'), 'error');
    }
    else {
      drupal_set_message(t('Your message has been sent. ' . $form_state->getValue('toField')));
    }
  }

  /**
 * Implements hook_mail().
 */
function swedishamerican_providers_mail($key, &$message, $params) {
  $options = array(
    'langcode' => $message['langcode'],
  );
  switch ($key) {
    case 'swedishamerican_providers':
      $message['from'] = \Drupal::config('system.site')->get('mail');
      $message['subject'] = t('Your mail subject Here: @title', array('@title' => $params['title']), $options);
      $message['body'][] = Html::escape($params['message']);
      drupal_set_message(t('Your message from: ' . $message['from'] . ' has been sent to: . ' . $form_state->getValue('toField')));
      break;
  }
}


  /**
  * Helper function to query the print provider nodes
  */
  private function _queryProvideNodes($nid) {
    $query = \Drupal::entityQuery('node');
    $query->condition('status', 1);
    $query->condition('type', 'provider');
    $query->condition('nid', $nid);    
    $entity_ids = $query->execute();

    foreach($entity_ids as $nid) {
        $node = \Drupal\node\Entity\Node::load($nid);
    }

    return $node;
  }
}