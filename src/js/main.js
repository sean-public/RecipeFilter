recipe_selectors = [
	'.recipe-callout',
	'.tasty-recipes',
	'.easyrecipe',
	'.innerrecipe',
	'.recipe-summary.wide', // thepioneerwoman.com
	'.wprm-recipe-container',
	'.recipe-content',
	'.simple-recipe-pro',
	'div[itemtype="http://schema.org/Recipe"]',
	'div[itemtype="https://schema.org/Recipe"]',
]

const controls = `
	<div id="_rf_header">
		<button id="_rf_closebtn" class="_rfbtn">close recipe</button>
		RecipeFilter
		<button id="_rf_disablebtn" class="_rfbtn">disable on this site</button>
	</div>
`

function hidePopup(){
	$('#_rf_highlight').fadeOut();
}

function showPopup(){
	recipe_selectors.every(function(s){
		$r = $(s);
		if ($r.length === 1){
			// clone the matched element and add some control buttons
			$r.clone().attr('id', '_rf_highlight').prependTo('body').append(controls).fadeIn(500);

			// handle the two new buttons we attached to the popup
			$('#_rf_closebtn').on('click touchstart', function() { hidePopup() });
			$('#_rf_disablebtn').on('click touchstart', function(){
				chrome.storage.sync.set({[document.location.hostname]: true}, hidePopup);
			});

			// add an event listener for clicking outside the recipe to close it
			$(document).on('mouseup touchend', function(e){
				var container = $('#_rf_highlight');
				if (!container.is(e.target) && container.has(e.target).length === 0) 
				{
				    hidePopup();
				    $(document).unbind('mouseup');
				}
			});

			// scroll to top in case they hit refresh while lower in page
			$(window).scrollTop(0);
			// it worked, stop iterating through recipe_selectors
			return false;
		}
		return true;
	});
}

// check the blacklist to see if we should run on this site
chrome.storage.sync.get(document.location.hostname, function(items) {
	if (!(document.location.hostname in items)) {
		showPopup();
	}
});
