(function ($) {
  'use strict';

  Drupal.behaviors.swedishamerican = {
    attach: function(context, settings) {
		var mainController = {
			pathname: window.location.pathname, // Returns path only
			url: window.location.href,    // Returns full URL
			
			init: function() {

				console.log("window.location.hash: " + window.location.hash);
				console.log("window.location.hash.indexOf(\"services\"): " + window.location.hash.indexOf("services"));
				console.log("window.location.hash.indexOf(\"services/cancer-care\"): " + window.location.hash.indexOf("services/cancer-care"));

				console.log("window.location.href: " + window.location.href);
				console.log("window.location.href.indexOf(\"services\"): " + window.location.href.indexOf("services"));
				console.log("window.location.href.indexOf(\"services/cancer-care\"): " + window.location.href.indexOf("services/cancer-care"));

				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
					console.log('msie');

					if (window.location.hash.indexOf("senior-leadership") >= 0) {
						$('.senior-image').each(function() {
							var urlpath = $(this).attr("data-image");
							$(this).css('background-image', "url('" + urlpath + "')");
						});
					}
					else if (window.location.hash.indexOf("locations") >= 0) {
						console.log(window.location.hash.indexOf("locations"));

						$('.location-image-bg').each(function() {
							var urlpath = $(this).attr("data-location");
							$(this).css('background-image', "url('" + urlpath + "')");
						});
					}
	
					if ($(window).width() > 736) {
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
					}
					
					if ($(window).width() > 736) {
						if (this.pathname === '/') {
							$('header').css("background-image", "url(/themes/swedishamerican/images/img-HdrHome-01.png)");
							$('header').css("background-size", "cover");
							$('header').css("background-position", "center");
							$('header').css("height", "465px");
	
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
								if (name.length > 0) {
									urlpath = urlpath + "name=" + name + "&";
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
						// else if (this.pathname.includes("providers")) {	
						else if (window.location.hash.indexOf("providers") >= 0) {	
							$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-provider.png)");
							$('header').css("height", "335px");	
						}
						else if (window.location.hash.indexOf("find-a-doctor") >= 0) {
							$('.markup-area').detach().appendTo('#swedishamerican-providers-form');
							$('article').addClass('provider-article-padding-left');
							$('.navbar-header').addClass('full-alpha');	
						}
						else if (window.location.hash.indexOf("events") >= 0) {
							$('.navbar-header').addClass('full-alpha');		
							$('.markup-area').detach().appendTo('#swedishamerican-eventslist-form');
		
							$('.event-image').each(function() {
								var urlpath = $(this).attr("data-event");
								$(this).css('background-image', "url('" + urlpath + "')");
							});
						}
						// else if (this.pathname.includes("services")) {
						else if (window.location.hash.indexOf("services") >= 0) {
							console.log(window.location.hash.indexOf("services"));

							if (window.location.hash.indexOf("services/cancer-care") >= 0) {
								console.log(window.location.hash.indexOf("services/cancer-care"));

								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-cancercare.png)");
							}
							else if (window.location.hash.indexOf("services/allergy-immunology")  >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-allergies.png)");
							}
							else if (window.location.hash.indexOf("services/audiology") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-audiology.png)");
							}
							else if (window.location.hash.indexOf("services/breast-care") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-breastCare.png)");
							}
							else if (window.location.hash.indexOf("services/diabetes-nutrition") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-nutrition.png)");
							}
							else if (window.location.hash.indexOf("services/emergency") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-emergency.png)");
							}
							else if (window.location.hash.indexOf("services/migraines") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-headachesMigraines.png)");
							}
							else if (window.location.hash.indexOf("services/heart-care") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-hearthealth.png)");
							}
							else if (window.location.hash.indexOf("services/holistic-health") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-holistic.png)");
							}
							else if (window.location.hash.indexOf("services/home-health-care") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-homecare.png)");
							}
							else if (window.location.hash.indexOf("services/medical-imaging") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-imaginglab.png)");
							}
							else if (window.location.hash.indexOf("services/kids-care") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-kidscare.png)");
							}
							else if (window.location.hash.indexOf("services/mental-health") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-mentalhealth.png)");
							}
							else if (window.location.hash.indexOf("services/orthopedics") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-ortho.png)");
							}
							else if (window.location.hash.indexOf("services/physical-therapy") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-phystherapy.png)");
							}
							else if (window.location.hash.indexOf("services/sleep-disorders") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-sleepstudy.png)");
							}
							else if (window.location.hash.indexOf("services/surgery") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-surgery.png)");
							}
							else if (window.location.hash.indexOf("services/wellness") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-wellness.png)");
							}
							else if (window.location.hash.indexOf("services/wound-care") >= 0) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-woundcare.png)");
							}
							else {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-services.png)");
							}
							$('header').css("background-size", "cover");
							$('header').css("background-position", "center");
							$('header').css("height", "250px");
						}
						else if (window.location.hash.indexOf("locations")  >= 0) {
							$('.footer').css("margin-top", "0");
							$('.navbar-header').addClass('full-alpha');
						}
						else if (window.location.hash.indexOf("blog") >= 0|| window.location.hash.indexOf("archive") >= 0 || window.location.hash.indexOf("categories") >= 0) {
							$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-blog.png)");
							$('header').css("background-size", "cover");
							$('header').css("background-position", "center");
							$('header').css("height", "250px");
						}
						else if (window.location.hash.indexOf("about") >= 0) {
							if ($(window).width() > 480) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-about.png)");
								$('header').css("background-size", "cover");
								$('header').css("background-position", "center");
								$('header').css("height", "250px");
							}
						}
						else if (window.location.hash.indexOf("patients") >= 0) {
							if ($(window).width() > 480) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-patients.png)");
								$('header').css("background-size", "cover");
								$('header').css("background-position", "center");
								$('header').css("height", "250px");
							}
						}
						else if (window.location.hash.indexOf("visitors") >= 0) {
							if ($(window).width() > 480) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-visitor.png)");
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
				}
				else {
					console.log('not msie');
					if (this.pathname.includes("senior-leadership")) {
						$('.senior-image').each(function() {
							var urlpath = $(this).attr("data-image");
							$(this).css('background-image', "url('" + urlpath + "')");
						});
					}
					else if (this.pathname.includes("locations")) {
						$('.location-image-bg').each(function() {
							var urlpath = $(this).attr("data-location");
							$(this).css('background-image', "url('" + urlpath + "')");
						});
					}
	
					if ($(window).width() > 736) {
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
					}
					
					if ($(window).width() > 736) {
						if (this.pathname === '/') {
							$('header').css("background-image", "url(/themes/swedishamerican/images/img-HdrHome-01.png)");
							$('header').css("background-size", "cover");
							$('header').css("background-position", "center");
							$('header').css("height", "465px");
	
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
								if (name.length > 0) {
									urlpath = urlpath + "name=" + name + "&";
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
						// else if (this.pathname.includes("providers")) {	
						else if (this.pathname.includes("providers") ) {	
							$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-provider.png)");
							$('header').css("height", "335px");	
						}
						else if (this.pathname.includes("find-a-doctor") ) {
							$('.markup-area').detach().appendTo('#swedishamerican-providers-form');
							$('article').addClass('provider-article-padding-left');
							$('.navbar-header').addClass('full-alpha');	
						}
						else if (this.pathname.includes("events") ) {
							$('.navbar-header').addClass('full-alpha');		
							$('.markup-area').detach().appendTo('#swedishamerican-eventslist-form');
		
							$('.event-image').each(function() {
								var urlpath = $(this).attr("data-event");
								$(this).css('background-image', "url('" + urlpath + "')");
							});
						}
						// else if (this.pathname.includes("services")) {
						else if (this.pathname.includes("services") ) {
							if (this.pathname.includes("services/cancer-care") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-cancercare.png)");
							}
							else if (this.pathname.includes("services/allergy-immunology")  ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-allergies.png)");
							}
							else if (this.pathname.includes("services/audiology") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-audiology.png)");
							}
							else if (this.pathname.includes("services/breast-care") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-breastCare.png)");
							}
							else if (this.pathname.includes("services/diabetes-nutrition") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-nutrition.png)");
							}
							else if (this.pathname.includes("services/emergency") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-emergency.png)");
							}
							else if (this.pathname.includes("services/migraines") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-headachesMigraines.png)");
							}
							else if (this.pathname.includes("services/heart-care") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-hearthealth.png)");
							}
							else if (this.pathname.includes("services/holistic-health") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-holistic.png)");
							}
							else if (this.pathname.includes("services/home-health-care") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-homecare.png)");
							}
							else if (this.pathname.includes("services/medical-imaging") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-imaginglab.png)");
							}
							else if (this.pathname.includes("services/kids-care") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-kidscare.png)");
							}
							else if (this.pathname.includes("services/mental-health") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-mentalhealth.png)");
							}
							else if (this.pathname.includes("services/orthopedics") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-ortho.png)");
							}
							else if (this.pathname.includes("services/physical-therapy") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-phystherapy.png)");
							}
							else if (this.pathname.includes("services/sleep-disorders") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-sleepstudy.png)");
							}
							else if (this.pathname.includes("services/surgery") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-surgery.png)");
							}
							else if (this.pathname.includes("services/wellness") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-wellness.png)");
							}
							else if (this.pathname.includes("services/wound-care") ) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-woundcare.png)");
							}
							else {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-services.png)");
							}
							$('header').css("background-size", "cover");
							$('header').css("background-position", "center");
							$('header').css("height", "250px");
						}
						else if (this.pathname.includes("locations")  ) {
							$('.footer').css("margin-top", "0");
							$('.navbar-header').addClass('full-alpha');
						}
						else if (this.pathname.includes("blog") || this.pathname.includes("archive")  || this.pathname.includes("categories") ) {
							$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-blog.png)");
							$('header').css("background-size", "cover");
							$('header').css("background-position", "center");
							$('header').css("height", "250px");
						}
						else if (this.pathname.includes("about") ) {
							if ($(window).width() > 480) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-about.png)");
								$('header').css("background-size", "cover");
								$('header').css("background-position", "center");
								$('header').css("height", "250px");
							}
						}
						else if (this.pathname.includes("patients") ) {
							if ($(window).width() > 480) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-patients.png)");
								$('header').css("background-size", "cover");
								$('header').css("background-position", "center");
								$('header').css("height", "250px");
							}
						}
						else if (this.pathname.includes("visitors") ) {
							if ($(window).width() > 480) {
								$('header').css("background-image", "url(/themes/swedishamerican/images/hdr-images/hdr-visitor.png)");
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
				}
			}
		};
		mainController.init();

		var colWidths = {
			init: function() {
				if ($(window).width() < 769) {
					if ($('.main-col').hasClass('all-three-col')) {
						$('.main-col').removeClass('col-sm-8');
						$('.main-col').addClass('col-sm-9');
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

				$( window ).on( "orientationchange", function( event ) {
					if ($(window).width() > 769) {
						if ($(window).width() < 1025) {
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
					}
					else {
						if ($(window).width() < 769) {
							if ($('.main-col').hasClass('all-three-col')) {
								$('.main-col').removeClass('col-sm-8');
								$('.main-col').addClass('col-sm-9');
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
					}
				});
			}
		}
		colWidths.init();

		var lightBox = {
			init: function() {
				if ($(window).width() < 769) {
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

						$( window ).resize(function() {
							console.log($(document).scrollTop());
						});
					});

					$(".card-provider, .location-card, .card-event").on("click", function() {
						if (!$('#overlay-content').hasClass('overlay-loaded')) {
							$('#overlay-content').addClass('overlay-loaded');

							var urlpath = $(this).attr("data-tag");
							$('#overlay-content').load(urlpath, function(data, status, xhr) {
								if( status === 'success' ) {
	
									$(".card-provider").on("click", function() {
										var urlpath = $(this).attr("data-tag");
										$('#overlay-content').html('');
										$('#overlay-content').load(urlpath, function(data, status, xhr) {
											if( status === 'success' ) {
	
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
					});
					
					$(".overlay-close, .backDrop, .btn-floating").on("click", function(){
						closeBox();
					});
	
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