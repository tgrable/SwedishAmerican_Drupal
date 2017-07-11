(function ($) {
  'use strict';

  Drupal.behaviors.swedishamerican = {
    attach: function(context, settings) {
		var mainController = {
			pathname: window.location.pathname, // Returns path only
			url: window.location.href,    // Returns full URL
			
			init: function() {

				if (!$('.extra-services').length) {
    				var menuString = '<li class="extra-services"><div class="bs-menu"><h2>Services A - Z</h2><ul><li><a href="#">Audiology</a></li><li><a href="#">DaVinci Surgery</a></li><li><a href="#">Diabetes & Nutrition</a></li><li><a href="#">Emergency Care</a></li><li><a href="#">Holistic Health</a></li><li><a href="#">Home Health Care</a></li><li><a href="#">Immediate / Urgent Care</a></li><li><a href="#">Laboratory Services</a></li><li><a href="#">Medical Imaging</a></li><li><a href="#">Mental Health</a></li><li><a href="#">Occupational Care</a></li><li><a href="#">Outpatient Therapy</a></li><li><a href="#">Palliative Care</a></li><li><a href="#">Pediactrics</a></li><li><a href="#">Pharmacy</a></li><li><a href="#">Primary Care / Family Medicine</a></li><li><a href="#">Sleep Disorders Centers</a></li><li><a href="#">Surgery</a></li><li><a href="#">Wellness</a></li><li><a href="#">Wound Care Clinic</a></li></ul></div></li>';
					$('.dropdown-menu:eq(0)').append(menuString);
				}

				if (this.pathname === '/') {
					$('header').css("background-image", "url(/themes/swedishamerican/images/img-HdrHome-01.png)");
					$('header').css("height", "615px");
				}
				else if (this.pathname.includes("provider")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/img-hdrProvider.png)");
					$('header').css("height", "335px");

					$('.markup-area').detach().appendTo('#swedishamerican-providers-form');

					$('.facebook-share').on('click', function(e) {
						var tag = $(e.target).parent().parent().parent().parent(),
						sib = tag.siblings().children(),
						url = sib.find('img').attr('src');

						var urlRoot = window.location.origin;
						var finalURL = urlRoot + '/' + $(this).data("href");

						var winTop = (screen.height / 2) - (500 / 2);
						var winLeft = (screen.width / 2) - (1150 / 2);
						window.open('https://www.facebook.com/sharer/sharer.php?u=' + finalURL, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + 575 + ',height=' + 250);
					});

					$('.twitter-share').on('click', function(e) {
						var urlRoot = window.location.origin;
						var title = $(this).data("name");
						var path = $(this).data("href");
						window.open("https://twitter.com/share?url=" + urlRoot + path + "&text=Check out " + title + " at Swedish American Hospital", "_blank", "width=575, height=250");
					});

					// Need to Fix
					$('.linkedin-share').on('click', function(e) {
						var urlRoot = window.location.origin;
						var title = $(this).data("name");
						var path = $(this).data("href");
						window.open("http://www.linkedin.com/shareArticle?mini=true&url=" + urlRoot + path + "&title=" + title, "_blank", "width=575, height=250"); 
					});
				}
				else if (this.pathname.includes("locations") || this.pathname.includes("services")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/img-hdrLocation.png)");
					$('header').css("height", "335px");
				}
				else if (this.pathname.includes("blog") || this.pathname.includes("archive") || this.pathname.includes("categories")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/img-hdrLocation.png)");
					$('header').css("height", "335px");
				}
				else {
					console.log('Else');
				}
			}
		};
		mainController.init();
    }
  };

}(jQuery, Drupal));