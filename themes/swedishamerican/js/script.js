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
						if ($(this).children('a').attr("data-drupal-link-system-path") == 'node/246' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/170' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/181' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/172' || $(this).children('a').attr("data-drupal-link-system-path") == 'node/174') {
							$(this).children('a').addClass('brand-primary');
						}
						else {
							$(this).detach();
							extra.push($(this).html());
						}
					});
					var maniMenuString = '<li class="extra-services"><div class="bs-menu"><ul>';
					for (var i = 0; i < extra.length; i++) {
						maniMenuString += '<li>' + extra[i] + '</li>';
					}
					maniMenuString += '</ul></li>';
					$('.dropdown-menu:eq(0)').append(maniMenuString);
				}

				if (this.pathname === '/') {
					if ($(window).width() > 736) {

						$( window ).resize(function() {
							var height = $('#animation_container').height() + 30;
							$('header').css('height', height + 'px');
						});
					}
				}
				else if (window.location.href.indexOf("find-a-doctor") >= 0) {
					$('.navbar-header').addClass('full-alpha');	

					if ($(window).width() > 736) { 
						$('.markup-area').detach().appendTo('#swedishamerican-providers-form');
						$('article').addClass('provider-article-padding-left');
					}

					var page = $('html, body');

					$(window).scroll(function() {
						page.stop();

						if ($(window).scrollTop() > 400) {
							$('#scrollToTopBtn').css('display', 'block');
						}
						else {
							$('#scrollToTopBtn').css('display', 'none');
						}
					});
					
					$('#scrollToTopBtn').on('click', function() {
						// $('html, body').animate({scrollTop:0}, 2500, 'swing');
						
						if (!$(this).hasClass('isAnimating')) {
							$(this).addClass('isAnimating');
							console.log("Animate");
							page.animate({scrollTop:0}, 2500, function(){
								$('#scrollToTopBtn').removeClass('isAnimating');
								console.log("End Animate");
							});
						}
					}); 
				}
				else if (window.location.href.indexOf("provider/") >= 0) {
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

					$('.linkedin-share').on('click', function(e) {
						var urlRoot = window.location.origin;
						var title = $(this).data("name");
						var path = $(this).data("href");
						var windowName = 'SwedishAmerican';
						window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + escape(urlRoot + path) + '&title=' + title + '&source=SwedishAmerican&target=new', windowName, "height=575,width=575");

					});
				}
				else if (window.location.href.indexOf("events") >= 0) {
					$('.navbar-header').addClass('full-alpha');
					
					if ($(window).width() > 736) { 
						$('.markup-area').detach().appendTo('#swedishamerican-eventslist-form');
					}
					
					$('.event-image').each(function() {
						var urlpath = $(this).attr("data-event");
						$(this).css('background-image', "url('" + urlpath + "')");
					});
				}
				else if (window.location.href.indexOf("new-location") >= 0) {
					$('.navbar-header').addClass('full-alpha');
					
					$('h1 span').css("margin-top", "30px");

					$('.location-image').each(function() {
						var urlpath = $(this).attr("data-location");
						$(this).css('background-image', "url('" + urlpath + "')");
					});

					$( "#edit-location" ).change(function() {
						if ($( "#edit-location" ).val().length > 0) {
							window.location.href = $( "#edit-location" ).val();
						}						
					});
				}
				else if (window.location.href.indexOf("locations")  >= 0) {
					$('.navbar-header').addClass('full-alpha');

					$('h1 span').css("margin-top", "30px");

					$('.location-image').each(function() {
						var urlpath = $(this).attr("data-location");
						$(this).css('background-image', "url('" + urlpath + "')");
					});

					// $( "#edit-location" ).change(function() {
					// 	window.location.href = $( "#edit-location" ).val();
					// });

					$('.footer').css("margin-top", "0");
					$('.navbar-header').addClass('full-alpha');

					$('.location-image-bg').each(function() {
						var urlpath = $(this).attr("data-location");
						$(this).css('background-image', "url('" + urlpath + "')");
					});

					$('.map-image-container .map iframe').on("load", function() {
						$('.map-image-container .map iframe').css("height", $('.map-image-container img').height());
						$('.map-image-container .map iframe').css("width", '100%');
					});
					$( window ).resize(function() {
						$('.map-image-container .map iframe').css("height", $('.map-image-container img').height());
						$('.map-image-container .map iframe').css("width", '100%');
					});
				}
				else if (window.location.href.indexOf("senior-leadership") >= 0) {
					if ($(window).width() > 767) { 
						$('header').css('height', '250px');
					}

					$( window ).resize(function() {
						if ($(window).width() > 767) { 
							$('header').css('height', '250px');
						}
						else {
							$('header').css('height', '52px');
						}
					});
					
					$('.senior-image').each(function() {
						var urlpath = $(this).attr("data-image");
						$(this).css('background-image', "url('" + urlpath + "')");
					});
				}
				else if (window.location.href.indexOf("services/") >= 0) {
					if ($(window).width() > 767) {
						$('header').css('height', '250px');
					}
					$( window ).resize(function() {
						if ($(window).width() > 767) { 
							$('header').css('height', '250px');
						}
						else {
							$('header').css('height', '52px');
						}
					});
					
					if ($(window).width() > 736) { 
						if (!$('.location-address').hasClass('location-resized')) {
							$('.location-address').addClass('location-resized')

							if ($(window).width() >= 992) {
								mainController.resizeContainer();

								if (navigator.userAgent.match(/(iPad|Safari)/)) {
									$('.location-address iframe').load(function() {
										mainController.resizeContainer();
									});
								}
							}				

							$( window ).on( "orientationchange", function( event ) {
								console.log("orientationchange");
								if ($(window).width() > $(window).height()) {
									mainController.resizeContainer();
								}
								else {
									$('.location-address').css('width', "100%");
								}
							});

							$( window ).resize(function() {
								if ($(window).width() >= 992) {
									mainController.resizeContainer();
								}
								else {
									$('.location-address').css('width', "100%");
								}
							});
						}
					}
				}
				else {
					if ($(window).width() > 767) { 
						$('header').css('height', '250px');
					}
					$( window ).resize(function() {
						if ($(window).width() > 767) { 
							$('header').css('height', '250px');
						}
						else {
							$('header').css('height', '52px');
						}
					});
				}
			},
			resizeContainer: function() {
				var mainContainer = $('.term-content-container').width();
				var phoneContainer = $('.phone-email').width() + 61;
				var mapContainer = $('.location-address').width();
				
				if ((phoneContainer + mapContainer) > (mainContainer)) {
					var newWidth = 100 - ((phoneContainer / mainContainer) * 100);
					$('.location-address').css('width', parseInt(newWidth - 2) + "%");
				}
			}
		};
		mainController.init();

		var lazyLoad ={
			init: function(){
                $(".lazy").lazy();
			}
		};
		lazyLoad.init();

		var mobileNavigation = {
			init: function() {
				if (navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS)/)) {
					$('li.dropdown').addClass('mobile-nav');
					$('li.dropdown').children('ul.dropdown-menu').css('display', 'none');

					$('li.dropdown').on('click', function() {
						if($(this).children('ul.dropdown-menu').css('display') == 'none') {
							$('li.dropdown').children('ul.dropdown-menu').css('display', 'none');
							$(this).children('ul.dropdown-menu').css('display', 'block');
						}
						else {
							$(this).children('ul.dropdown-menu').css('display', 'none');
							$('.navbar-inverse .navbar-nav > li > a:hover').css('border-bottom', 'none');
						}
					});
				}
			}
		}
		mobileNavigation.init();

		var safariHack = {
			init: function() {
				if (navigator.userAgent.match(/(Safari)/) && !navigator.userAgent.match(/(Chrome)/)) {
					if ($('.region-navigation-collapsible section').length > 0) {
						var block = $('.region-navigation-collapsible section').attr('id');
						if (block.startsWith('block-') && block.endsWith('banner')) {
							if ($('.region-navigation-collapsible section').hasClass('clearfix')) {
								$('.region-navigation-collapsible section').removeClass('clearfix');
							}	
						}
					}
				}
			}
		}
		safariHack.init();

		var flipCards = {
			pathname: window.location.pathname, // Returns path only
			url: window.location.href,    // Returns full URL

			init: function() {
				if ($(window).width() > 736) {
					if (this.pathname === '/' && !navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
						$('#flip_container_11').mouseover(function() {
							if (!$('#flip_container_11').hasClass('applyflip')) {
								$('#flip_container_11').addClass('applyflip');
							}	
						});

						$('#flip_container_11').mouseout(function() {
							if ($('#flip_container_11').hasClass('applyflip')) {
								$('#flip_container_11').removeClass('applyflip');
							}
						});

						$('#flip_container_12').mouseover(function() {
							if (!$('#flip_container_12').hasClass('applyflip')) {
								$('#flip_container_12').addClass('applyflip');
							}	
						});

						$('#flip_container_12').mouseout(function() {
							if ($('#flip_container_12').hasClass('applyflip')) {
								$('#flip_container_12').removeClass('applyflip');
							}
						});

						$('#flip_container_15').mouseover(function() {
							if (!$('#flip_container_15').hasClass('applyflip')) {
								$('#flip_container_15').addClass('applyflip');
							}	
						});

						$('#flip_container_15').mouseout(function() {
							if ($('#flip_container_15').hasClass('applyflip')) {
								$('#flip_container_15').removeClass('applyflip');
							}
						});

						$('.provider-search-form-button').on('click', function() {
							var name = $('#provider-search-form-name').val();
							var location = $('#provider-search-form-locations').val();
							var specialty = $('#provider-search-form-specialties').val();
							var gender = $('#provider-search-form-gender').val();
							
							var urlpath = "/find-a-doctor?";
							if (name.length > 0) {
								urlpath = urlpath + "name=" + name + "&";
							}

							if ($('#provider-search-form-locations').val() != 'location') {
								urlpath = urlpath + "location=" + location + "&";
							}

							if ($('#provider-search-form-specialties').val() != 'specialty') {
								urlpath = urlpath + "specialty=" + specialty + "&";
							}

							if ($('#provider-search-form-gender').val() != "gender") {
								urlpath = urlpath + "gender=" + gender;
							}

							var lastChar = urlpath[urlpath.length -1];
							if (lastChar == "&") {
								urlpath = urlpath.slice(0, -1);
							}

							window.location.href = urlpath;
						});

						$('.location-search-form-button').on('click', function() {
							var name = $('#location-search-form-name').val();
							var city = $('#location-search-form-city').val();
							
							var urlpath = "/locations?";
							if ($('#location-search-form-name').val() != "location") {
								urlpath = urlpath + "name_1=" + $('#location-search-form-name').val() + "&";
							}

							if ($('#location-search-form-city').val() != "city") {
								urlpath = urlpath + "field_city_value=" + $('#location-search-form-city').val() + "&";
							}

							// if ($('#location-search-form-name').val() != "location") {
							// 	urlpath = urlpath + "location=" + $('#location-search-form-name').val() + "&";
							// }

							// if ($('#location-search-form-city').val() != "city") {
							// 	urlpath = urlpath + "city=" + $('#location-search-form-city').val() + "&";
							// }

							// if ($('#location-search-form-service').val() != "service") {
							// 	urlpath = urlpath + "service=" + $('#location-search-form-service').val() + "&";
							// }

							var lastChar = urlpath[urlpath.length -1];
							if (lastChar == "&") {
								urlpath = urlpath.slice(0, -1);
							}

							window.location.href = urlpath;
						});

						$('.event-search-form-button').on('click', function() {
							var keyword = $('#event-search-form-keyword').val();
							
							var urlpath = "/classes-events?";
							if (keyword.length > 0) {
								urlpath = urlpath + "keyword=" + keyword + "&";
							}

							if ($('#event-search-form').val() != "event") {
								urlpath = urlpath + "category=" + $('#event-search-form').val();
							}

							var lastChar = urlpath[urlpath.length -1];
							if (lastChar == "&") {
								urlpath = urlpath.slice(0, -1);
							}

							window.location.href = urlpath;
						});
					}
				}
			}
		}
		flipCards.init();
		
		var lightBox = {
			init: function() {
				if ($(window).width() < 736 || navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					$(".card-provider, .location-card, .card-event").on("click", function() {
						var urlpath = $(this).attr("data-tag").split(" ");
						window.location.href = urlpath[0];
					});
				}
				else {
					$(".lightBox").on("click", function(){
						$('body').addClass('noscroll');
						$(".backDrop").animate({"opacity": ".70"}, 500);
						$(".box").animate({"opacity": "1.0"}, 500);
						$(".box").css("display", "flex");
						$(".box").css("position", "absolute");
						$(".box").css("top", $(document).scrollTop() + 25);
						$(".backDrop").css("display", "block");
					});

					$(".card-provider, .location-card, .card-event").on("click", function() {
						if (!$('#overlay-content').hasClass('overlay-loaded')) {
							$('#overlay-content').addClass('overlay-loaded');

							var urlpath = $(this).attr("data-tag");
							if ($(this).hasClass('location-card')) {
								$("#overlay-back").attr('data-back', urlpath);
							}

							loadOverlay(urlpath);
						}
					});

					$("#overlay-back").on("click", function() {
						var urlpath = $(this).attr("data-back");
						loadOverlay(urlpath);
						$(".overlay-back").css('display', 'none');
					});
					
					$(".overlay-close, .backDrop").on("click", function(){
						closeBox();
					});

					function loadOverlay(urlpath) {
						$('#overlay-content').html('');
						$('#overlay-content').load(urlpath, function(data, status, xhr) {
							if( status === 'success' ) {
								$('#overlay-content .provider-container, #overlay-content .locations-container, #overlay-content .event-container').css('height', $(window).height()- 65);
								$(".card-provider").on("click", function() {
									if ($(this).hasClass('card-provider')) {
										console.log('WTF!');
										$(".overlay-back").css('display', 'block');
									}
									
									var urlpath = $(this).attr("data-tag");
									$('#overlay-content').html('');
									$('#overlay-content').load(urlpath, function(data, status, xhr) {
										if( status === 'success' ) {
											// $(".overlay-back").css('display', 'block');
											$('#overlay-content .provider-container, #overlay-content .locations-container, #overlay-content .event-container').css('height', $(window).height()- 65);
										}
									});
								});

								$('.map-image-container .map iframe').on("load", function() {
									$('.map-image-container .map iframe').attr("height", $('.map-image-container img').height());
								});
								$( window ).resize(function() {
									$('.map-image-container .map iframe').attr("height", $('.map-image-container img').height());
									$(".box").css("top", $(document).scrollTop() + 25);
								});

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
					}
	
					function closeBox(){
						$(".backDrop, .box").animate({"opacity": "0"}, 500, function(){
							$('#overlay-content').removeClass('overlay-loaded');
							$(".backDrop, .box").css("display", "none");
							$('#overlay-content').html('');
							$('body').removeClass('noscroll');
						});
					}
				}
			}
		}
		lightBox.init();
    }
  };

}(jQuery, Drupal));