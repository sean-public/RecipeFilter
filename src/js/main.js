recipe_selectors = [
	'div[itemtype="http://schema.org/Recipe"]',
	'div[itemtype="https://schema.org/Recipe"]',
	'.recipe-callout',
	'.tasty-recipes',
	'.easyrecipe',
	'.innerrecipe',
	'.wprm-recipe-container',
]

function hidePopup(){
	$('#_rf_highlight').fadeOut();
}

function showPopup(){
	recipe_selectors.every(function(s){
		$r = $(s);
		if ($r.length === 1){
			$r.clone().attr('id', '_rf_highlight').prependTo('body').append(`
				<div id="_rf_header">
					<button id="_rf_closebtn">close recipe</button> 
					<button id="_rf_disablebtn">disable on this site</button> 
				</div>
			`).fadeIn(500);

			$('#_rf_closebtn').click(hidePopup);
			$('#_rf_disablebtn').click(function(b){
				chrome.storage.sync.set({[document.location.hostname]: true}, hidePopup);
			});
			return false;	// it worked, stop iterating through recipe_selectors
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
