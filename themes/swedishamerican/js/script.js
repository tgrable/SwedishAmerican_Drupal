(function ($) {
  'use strict';

  Drupal.behaviors.swedishamerican = {
    attach: function(context, settings) {
			
			var mainController = {
				
				pathname: window.location.pathname, // Returns path only
				url: window.location.href,    // Returns full URL
				
				init: function() {
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

						// $('.service-nav-container').height($('.service-container').height());
					}
					else {
						console.log('Else');
					}
				}
			};
			mainController.init();

    }
  };

}(jQuery));