<?php
/**
 * @file
 * Contains \Drupal\swedishamerican_providers\Form\PrintProviderForm.
 */
namespace Drupal\swedishamerican_providers\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormStateInterface;

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
    $form['#cache'] = ['contexts' => ['url.query_args:id']];

    $nid = \Drupal::request()->query->get('id');
    $node = $this->_queryProvideNodes($nid);

    if ($node != null) {
      $title = $node->get('field_provider_name')->getValue();
  
      $form['wrapper'] = array(
          '#prefix' => '<h2>Email ' . $title[0]['value'] . ' to a Friend</h2>'
      );
  
      $form['wrapper']['toField'] = array (
        '#type' => 'textfield',
        '#placeholder' => 'To:',
        '#default_value' => ''
      );
  
      $form['my_captcha_element'] = array(
        '#type' => 'captcha',
        '#captcha_type' => 'captcha/Math',
      );
  
      $form['submit_button'] = array(
        '#type' => 'submit',
        '#value' => t('Share'),
      );
    }
    else {
      $form['wrapper'] = array(
        '#prefix' => '<h2>Whoops! Looks like something went wrong.</h2>'
      );
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $to = $form_state->getValue('toField');
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
      $form_state->setErrorByName('toField', $this->t('Please enter a valid email address.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $nidQueryString = $_SERVER["QUERY_STRING"];
  	$nid = explode("=", $nidQueryString);
    $node = $this->_queryProvideNodes($nid[1]);
    $title = $node->get('field_provider_name')->getValue();
    $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$node->id());

    $send_mail = new \Drupal\Core\Mail\Plugin\Mail\PhpMail(); // this is used to send HTML emails
    $to = $form_state->getValue('toField');
    $message['headers'] = array(
      'content-type' => 'text/html',
      'MIME-Version' => '1.0',
      'reply-to' => 'noreply@swedishamerican.org',
      'from' => 'SwediahAmerican Website' . '<noreply@swedishamerican.org>'
    );
    $message['to'] = $to;
    $message['subject'] = "SwediahAmerican Provider";
    
    $protocol = isset($_SERVER["HTTPS"]) ? 'https' : 'http';
    $host = \Drupal::request()->getHost();

    $message['body'] = '<h1>SwedishAmerican Website</h1>';
    $message['body'] .= '<p>A friend shared a provider page from SwedishAmerican’s website with you. Click the link to view: ';
    $message['body'] .= '<a href="' . $protocol . '://' . $host . $alias .' " target="_blank">' . $title[0]['value'] . '</a></p>';
     
    $send_mail->mail($message);

    drupal_set_message(t('Your message has been sent. ' . $form_state->getValue('toField')));
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

    if (count($entity_ids) > 0) {
      foreach($entity_ids as $nid) {
        $node = \Drupal\node\Entity\Node::load($nid);
      }
      return $node;
    }
    else {
      return null;
    }
  }
}