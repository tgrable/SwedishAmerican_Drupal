(function ($) {
  'use strict';

  Drupal.behaviors.swedishamerican = {
    attach: function(context, settings) {
        $('.effect__click').unbind('click').bind('click', function(event) {
            if ($('#' + $(this).attr("id")).hasClass("flipped")) {
                $('#' + $(this).attr("id")).removeClass("flipped");
            }
            else {
                $('#' + $(this).attr("id")).addClass("flipped");
            }
        });
    }
  };

}(jQuery));