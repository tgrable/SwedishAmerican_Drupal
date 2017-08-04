(function ($) {
  'use strict';

  Drupal.behaviors.swedishamerican = {
    attach: function(context, settings) {
		var mainController = {
			pathname: window.location.pathname, // Returns path only
			url: window.location.href,    // Returns full URL
			
			init: function() {
				if (!$('.extra-services').length) {
					var main = [];
					var extra = [];

					$('.dropdown-menu:eq(0) li').each(function(key, value) {
						console.log($(this).children('a').attr("data-drupal-link-system-path"));
						if ($(this).children('a').attr("data-drupal-link-system-path") == 'node/246' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/181' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/154' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/170') {
							console.log('found a menu item');
						}
						else {
							$(this).detach();
							extra.push($(this).html());
						}
					});
					var maniMenuString = '<li class="extra-services"><div class="bs-menu"><h2>Services A - Z</h2><ul>';
					for (var i = 0; i < extra.length; i++) {
						maniMenuString += '<li>' + extra[i] + '</li>';
					}
					maniMenuString += '</ul></li>';
					$('.dropdown-menu:eq(0)').append(maniMenuString);
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
				else if (this.pathname.includes("events")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-events.png)");
					$('header').css("height", "335px");				
					$('.markup-area').detach().appendTo('#swedishamerican-eventslist-form');
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
					$('.footer').css("margin-top", "0");
				}
				else if (this.pathname.includes("blog") || this.pathname.includes("archive") || this.pathname.includes("categories")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-blog.png)");
					$('header').css("height", "335px");
				}
				else if (this.pathname.includes("about")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-about.png)");
					$('header').css("height", "335px");
				}
				else {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-about.png)");
					$('header').css("height", "335px");
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
				
				$(".card-provider, .location-card, .card-event").on("click", function() {
					var urlpath = $(this).attr("data-tag");
					$('#overlay-content').load(urlpath, function(data, status, xhr) {
						if( status === 'success' ) {                        
							$.getScript("/themes/swedishamerican/js/social.js", function(data, textStatus, jqxhr) {
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
									window.open("https://twitter.com/share?url=" + urlRoot + path + "&text=Check out " + title + " at SwedishAmerican", "_blank", "width=575, height=250");
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