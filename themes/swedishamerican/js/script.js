(function ($) {
  'use strict';

  Drupal.behaviors.swedishamerican = {
    attach: function(context, settings) {
		var mainController = {
			pathname: window.location.pathname, // Returns path only
			url: window.location.href,    // Returns full URL
			
			init: function() {
				if ($(window).width() > 480) {
					if (!$('.extra-services').length) {
						var main = [];
						var extra = [];
	
						$('.dropdown-menu:eq(0) li').each(function(key, value) {
							if ($(this).children('a').attr("data-drupal-link-system-path") == 'node/246' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/181' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/154' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/170') {
								$(this).children('a').addClass('brand-primary');
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
				}

				if (this.pathname === '/') {
					$('header').css("background-image", "url(/themes/swedishamerican/images/img-HdrHome-01.png)");
					$('header').css("background-size", "cover");
					$('header').css("background-position", "center");
					$('header').css("height", "465px");
				}
				else if (this.pathname.includes("providers")) {	
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-provider.png)");
					$('header').css("height", "335px");	
				}
				else if (this.pathname.includes("find-a-doctor")) {
					$('.markup-area').detach().appendTo('#swedishamerican-providers-form');
					$('article').addClass('provider-article-padding-left');
					$('.navbar-header').addClass('full-alpha');

					$( window ).scroll(function() {
						// $('#dependant-fields-wrapper').css("height", height + 'px');
						console.log($(window).scrollTop());
						var fluid = "dependant-fields-wrapper-fluid";
						var sticky = "dependant-fields-wrapper-sticky";
						var scrollPosition = 120;
						if ($('.contextual').length != 0) {
							var fluid = "dependant-fields-wrapper-fluid-admin";
							var sticky = "dependant-fields-wrapper-sticky-admin";
							scrollPosition = 220;
						}

						if ($(window).scrollTop() > scrollPosition) {
							$('#dependant-fields-wrapper').removeClass(fluid);
							$('#dependant-fields-wrapper').addClass(sticky);
						}
						else {
							$('#dependant-fields-wrapper').removeClass(sticky);
							$('#dependant-fields-wrapper').addClass(fluid);
						}
					});

				}
				else if (this.pathname.includes("events")) {
					// $('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-events.png)");
					// $('header').css("background-size", "cover");
					// $('header').css("background-position", "center");
					// $('header').css("height", "250px");		
					$('.navbar-header').addClass('full-alpha');		
					$('.markup-area').detach().appendTo('#swedishamerican-eventslist-form');
				}
				else if (this.pathname.includes("services")) {
					if (this.pathname.includes("services/cancer-care")) {
						$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-cancercare.png)");
					}
					else {
						$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-services.png)");
					}
					$('header').css("background-size", "cover");
					$('header').css("background-position", "center");
					$('header').css("height", "250px");
				}
				else if (this.pathname.includes("locations")) {
					$('.footer').css("margin-top", "0");
					$('.navbar-header').addClass('full-alpha');
					console.log($(window).height());
					$('.location-image-bg').each(function() {
						var urlpath = $(this).attr("data-location");
						console.log(urlpath);
						$(this).css('background-image', "url('" + urlpath + "')");
					});
				}
				else if (this.pathname.includes("blog") || this.pathname.includes("archive") || this.pathname.includes("categories")) {
					$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-blog.png)");
					$('header').css("background-size", "cover");
					$('header').css("background-position", "center");
					$('header').css("height", "250px");
				}
				else if (this.pathname.includes("about")) {
					if ($(window).width() > 480) {
						$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-about.png)");
						$('header').css("background-size", "cover");
						$('header').css("background-position", "center");
						$('header').css("height", "250px");
					}
				}
				else {
					if ($(window).width() > 480) {
						$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-about.png)");
						$('header').css("background-size", "cover");
						$('header').css("background-position", "center");
						$('header').css("height", "250px");
					}
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