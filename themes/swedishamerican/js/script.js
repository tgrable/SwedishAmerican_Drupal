(function ($) {
  'use strict';

  Drupal.behaviors.swedishamerican = {
    attach: function(context, settings) {
		var mainController = {
			pathname: window.location.pathname, // Returns path only
			url: window.location.href,    // Returns full URL
			
			init: function() {
				$( window ).resize(function() {
					console.log($(window).width());
				});

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
				else if (window.location.href.indexOf("locations")  >= 0) {
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

					// if ($(window).width() < 736) {
						
					// }
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

							var mainContainer = $('.term-content-container').width();
							var phoneContainer = $('.phone-email').width() + 61;
							var mapContainer = $('.location-address').width();
	
							// console.log(mainContainer);
							// console.log(phoneContainer);
							// console.log(mapContainer);
	
							// console.log('-------------------------');
	
							// console.log((phoneContainer + mainContainer));
							// console.log((mainContainer - 10));
							
							if ((phoneContainer + mainContainer) > (mainContainer - 10)) {
								var newWidth = 100 - ((phoneContainer / mainContainer) * 100);
								$('.location-address').css('width', parseInt(newWidth - 2) + "%");
							}
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
			}
		};
		mainController.init();

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

							if (city.length > 0) {
								urlpath = urlpath + "field_city_value=" + city + "&";
							}

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

		var colWidths = {
			init: function() {
				console.log($(window).width());

				if ($(window).width() <= 1112) {
					if ($('.main-col').hasClass('all-three-col')) {
						// $('.main-col').removeClass('col-sm-8');
						// $('.main-col').addClass('col-sm-9');
					}
					else if ($('.main-col').hasClass('no-right-col')) {
						$('.main-col').removeClass('col-sm-10');
						$('.main-col').addClass('col-sm-9');
					}
					else if ($('.main-col').hasClass('no-left-col')) {
						$('.main-col').removeClass('col-sm-10');
						$('.main-col').addClass('col-sm-12');
					}
					else {
					
					}
				}

				$( window ).resize(function() {
					if ($(window).width() > 1112) { 
						if ($('.main-col').hasClass('all-three-col')) {
							// $('.main-col').removeClass('col-sm-8');
							// $('.main-col').addClass('col-sm-9');
						}
						else if ($('.main-col').hasClass('no-right-col')) {
							$('.main-col').removeClass('col-sm-10');
							$('.main-col').addClass('col-sm-9');
						}
						else if ($('.main-col').hasClass('no-left-col')) {
							$('.main-col').removeClass('col-sm-10');
							$('.main-col').addClass('col-sm-12');
						}
						else {
						
						};
					}
					else {
						// if ($('.main-col').hasClass('all-three-col')) {
						// 	$('.main-col').removeClass('col-sm-9');
						// 	$('.main-col').addClass('col-sm-8');
						// }
						// else if ($('.main-col').hasClass('no-right-col')) {
						// 	$('.main-col').removeClass('col-sm-9');
						// 	$('.main-col').addClass('col-sm-10');
						// }
						// else if ($('.main-col').hasClass('no-left-col')) {
						// 	$('.main-col').removeClass('col-sm-12');
						// 	$('.main-col').addClass('col-sm-10');
						// }
						// else {
						
						// };
					}
				});

				$( window ).on( "orientationchange", function( event ) {
					console.log('orientationchange');
					if ($(window).width() > $(window).height()) {
						console.log('Landscape');
						if ($('.main-col').hasClass('all-three-col')) {
							$('.main-col').addClass('col-sm-8');
							$('.main-col').removeClass('col-sm-9');
						}
						else if ($('.main-col').hasClass('no-right-col')) {
							$('.main-col').addClass('col-sm-10');
							$('.main-col').removeClass('col-sm-9');
						}
						else if ($('.main-col').hasClass('no-left-col')) {
							$('.main-col').addClass('col-sm-10');
							$('.main-col').removeClass('col-sm-12');
						}
						else {
						
						}

					}
					else {
						console.log('Portrait');
						if ($('.main-col').hasClass('all-three-col')) {
							$('.main-col').addClass('col-sm-8');
							$('.main-col').removeClass('col-sm-9');
						}
						else if ($('.main-col').hasClass('no-right-col')) {
							$('.main-col').addClass('col-sm-10');
							$('.main-col').removeClass('col-sm-9');
						}
						else if ($('.main-col').hasClass('no-left-col')) {
							$('.main-col').addClass('col-sm-10');
							$('.main-col').removeClass('col-sm-12');
						}
						else {
						
						}
					}
					

					// if ($(window).width() >= 768) {
					// 	console.log('>= 834');

					// 	if ($(window).width() <= 1024) {
					// 		console.log('<= 1024');

					// 		if ($('.main-col').hasClass('all-three-col')) {
					// 			$('.main-col').addClass('col-sm-8');
					// 			$('.main-col').removeClass('col-sm-9');
					// 		}
					// 		else if ($('.main-col').hasClass('no-right-col')) {
					// 			$('.main-col').addClass('col-sm-10');
					// 			$('.main-col').removeClass('col-sm-9');
					// 		}
					// 		else if ($('.main-col').hasClass('no-left-col')) {
					// 			$('.main-col').addClass('col-sm-10');
					// 			$('.main-col').removeClass('col-sm-12');
					// 		}
					// 		else {
							
					// 		}
					// 	}
		
					// }
					// else {
					// 	console.log('! >= 834');

					// 	if ($(window).width() <= 768) {

					// 		console.log('! <= 834');

					// 		if ($('.main-col').hasClass('all-three-col')) {
					// 			$('.main-col').removeClass('col-sm-8');
					// 			$('.main-col').addClass('col-sm-9');
					// 		}
					// 		else if ($('.main-col').hasClass('no-right-col')) {
					// 			$('.main-col').removeClass('col-sm-10');
					// 			$('.main-col').addClass('col-sm-9');
					// 		}
					// 		else if ($('.main-col').hasClass('no-left-col')) {
					// 			$('.main-col').removeClass('col-sm-10');
					// 			$('.main-col').addClass('col-sm-12');
					// 		}
					// 		else {
							
					// 		}
					// 	}
					// }
				});
			}
		}
		colWidths.init();

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