<?php

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Include the Pantheon-specific settings file.
 *
 * n.b. The settings.pantheon.php file makes some changes
 *      that affect all envrionments that this site
 *      exists in.  Always include this file, even in
 *      a local development environment, to insure that
 *      the site settings remain consistent.
 */
include __DIR__ . "/settings.pantheon.php";

/**
 * If there is a local settings file, then include it
 */
$local_settings = __DIR__ . "/settings.local.php";
if (file_exists($local_settings)) {
  include $local_settings;
}
$settings['install_profile'] = 'standard';

// error_reporting(E_ALL);
// ini_set('display_errors', TRUE);
// ini_set('display_startup_errors', TRUE);

if (isset($_SERVER['PANTHEON_ENVIRONMENT']) && php_sapi_name() != 'cli') {
    // Redirect to https://$primary_domain in the Live environment
    if ($_ENV['PANTHEON_ENVIRONMENT'] === 'live') {
        $primary_domain = 'www.swedishamerican.org';
        $current_domain = $_SERVER['HTTP_HOST'];
        //domains that need special redirects
        $special_domains = array("swedesdelivers.com","swedesdelivers.org","swedesdelivers.net");

        if ($current_domain != $primary_domain
            || !isset($_SERVER['HTTP_X_SSL'])
            || $_SERVER['HTTP_X_SSL'] != 'ON') {

            # Name transaction "redirect" in New Relic for improved reporting (optional)
            if (extension_loaded('newrelic')) {
                newrelic_name_transaction("redirect");
            }

            if ( in_array($current_domain, $special_domains )  ){
                header('HTTP/1.0 301 Moved Permanently');
                header('Location: https://' . $primary_domain . "/services/maternity-care");
                exit();
            } else {
                header('HTTP/1.0 301 Moved Permanently');
                header('Location: https://' . $primary_domain . $_SERVER['REQUEST_URI']);
                exit();
            }
        }

        // Drupal 8 Trusted Host Settings
        if (is_array($settings)) {
            $settings['trusted_host_patterns'] = array('^' . preg_quote($primary_domain) . '$');
        }
    }
}