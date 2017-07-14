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
    $nidQueryString = $_SERVER["QUERY_STRING"];
  	$nid = explode("=", $nidQueryString);
    $node = $this->_queryProvideNodes($nid[1]);
    $title = $node->get('title')->getValue();

    $form['wrapper'] = array(
        '#prefix' => '<h2>Email ' . $title[0]['value'] . ' to a Friend</h2>'
    );

    $form['wrapper']['toField'] = array (
      '#type' => 'textfield',
      '#placeholder' => 'To:',
    );

    $form['wrapper']['fromField'] = array (
      '#type' => 'textfield',
      '#placeholder' => 'From:',
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

    $subject = "SwedishAmerican Providers";
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