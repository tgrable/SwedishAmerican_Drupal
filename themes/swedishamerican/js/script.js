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
					if (this.pathname !== '/providers') {
						$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-provider.png)");
						$('header').css("height", "335px");
					}
					else {
						$('.markup-area').detach().appendTo('#swedishamerican-providers-form');
					}
				}
				else if (this.pathname.includes("services")) {
					if (this.pathname.includes("services/cancer-care")) {
						$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-cancercare.png)");
					}
					else {
						$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-services.png)");
					}
					$('header').css("height", "335px");
				}
				else if (this.pathname.includes("locations")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/img-hdrLocation.png)");
					$('header').css("height", "335px");
				}
				else if (this.pathname.includes("blog") || this.pathname.includes("archive") || this.pathname.includes("categories")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-blog.png)");
					$('header').css("height", "335px");
				}
				else if (this.pathname.includes("events")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-events.png)");
					$('header').css("height", "335px");
				}
				else if (this.pathname.includes("about-us")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-about.png)");
					$('header').css("height", "335px");
				}
				else {
					console.log('Else');
				}
			}
		};
		mainController.init();

		var lightBox = {
			init: function() {
				$(".lightBox").on("click", function(){
					$(".backDrop").animate({"opacity": ".70"}, 500);
					$(".box").animate({"opacity": "1.0"}, 500);
					$(".box").css("display", "flex");
					$(".box").css("position", "absolute");
					$(".box").css("top", $(document).scrollTop());
					$(".backDrop").css("display", "block");
				});
				
				$(".card").on("click", function(){
					var urlpath = $(this).attr("data-tag");
					$('#overlay-content').load(urlpath, function(data, status, xhr) {
						if( status === 'success' ) {                        
							$.getScript("/themes/swedishamerican/js/social.js", function(data, textStatus, jqxhr) {
								$('.facebook-share').on('click', function(e) {
									console.log('facebook-share');

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
									var windowName = 'SwedishAmerican';
									window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + escape(urlRoot + path) + '&title=' + title + '&source=SwedishAmerican&target=new', windowName, "height=575,width=575");

								});
							});
						}
					});
				});
				
				$(".overlay-close, .backDrop, .btn-floating").on("click", function(){
					console.log('click')
					closeBox();
				});

				function closeBox(){
					$(".backDrop, .box").animate({"opacity": "0"}, 500, function(){
						$(".backDrop, .box").css("display", "none");
						$('#overlay-content').html('');
					});
				}
			}
		}
		lightBox.init();
    }
  };

}(jQuery, Drupal));