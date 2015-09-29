var TargetShow = TargetShow || {};

TargetShow.Create = function (options) {
	var $rootElement = {};
	var $overlay = {};
	var $slide = {};
	var $content = {};
	var $closeButton = $("<a href='#' class='close'>x</a>");

	//create outer frame
	$rootElement = $(options.element).addClass('targetshow-outside-frame').hide();

	//create inner overlay
	var template = "<div class='targetshow-overlay'>" +
	"<div class='slide'><div class='content'></div></div>" +
	"</div>";
	$overlay = $(template);

	$overlay.prepend($closeButton);

	$rootElement.append($overlay);
	$rootElement.css({backgroundImage: 'url(' + options.backgroundImage +')'});

	$overlay.hide();

	$slide = $overlay.find('.slide');
	$content = $slide.find('.content');

	$overlay.find('.close').click(function(event){
		event.preventDefault();
		hideSlide();
	});

	$(document).tooltip();

	for(var i in options.targets) {
		addTarget(options.targets[i]);
	}

	this.Start = function() {
		$rootElement.addClass('active').fadeTo('slow', 1, function(){
			$rootElement.find(".targetshow-target").each(function(){
				$(this).fadeTo('slow', 1);
			});
		});

		return this;
	}

	function addTarget(target) {
		var template = "<div class='targetshow-target' style='top:" + target.y + "px;left: " + target.x + "px;'>" +
					    "<a href='#' title='" + target.tooltip + "'>" +
			            "<img src='targetshow/images/target.png' />" + 
			            "</a>" +
			            "</div>";

		var $thisTarget = $(template);

		$rootElement.append($thisTarget);

		$thisTarget.click(function(event){
			event.preventDefault();
			showSlide(target);
		});

		$thisTarget.mouseenter(function(){
			$thisTarget.find('img').attr('src', 'targetshow/images/target-hover.png')
		});

		$thisTarget.mouseleave(function(){
			$thisTarget.find('img').attr('src', 'targetshow/images/target.png')
		});
		return this;
	}

	function getTargets() {
		return $rootElement.find(".targetshow-target");
	}

	function showSlide(target) {
		$content.html(target.content);
		$slide.find('img').remove();

		$(".bx-controls-direction").hide();

		switch(target.direction)
		{
			case 'n':
				$slide.prepend("<img class='north-image' src='" + target.image + "' />");
				$content.addClass('north');
				break;
			case 's':
				$slide.append("<img class='south-image' src='" + target.image + "' />");
				$content.addClass('east');
				break;
			case 'e':
				$slide.prepend("<img class='east-image' src='" + target.image + "' />");
				$content.addClass('text-left');
				$content.addClass('east');
				break;
			case 'w':
				$slide.prepend("<img class='west-image' src='" + target.image + "' />");
				$content.addClass('text-left');
				$content.addClass('west');
				break;

			default:
				break;
		}

		if(target.textHeight) {
			$content.css({maxHeight: target.textHeight + 'px'});
		}

		toggleAllTargets(0, function(){
			$overlay.fadeTo('slow', 1);
		});
	}

	function hideSlide() {
		$overlay.fadeTo('slow', 0, function() {
			$overlay.hide();
			toggleAllTargets(1, function(){
				$(".bx-controls-direction").show();
			});
		});
	}

	function toggleAllTargets(opacity, callback) {
		var $targets = getTargets();

		$targets.each(function(index){
			$(this).fadeTo('fast', opacity, function() {

				if($targets.length - 1 == index) {
					callback();
				}
			});
		});
	}
}
