recipe_selectors = [
	'div[itemtype="http://schema.org/Recipe"]',
	'div[itemtype="https://schema.org/Recipe"]',
	'.recipe-callout',
	'.tasty-recipes',
	'.easyrecipe',
	'.innerrecipe',
]


recipe_selectors.every(function(s){
	$r = $(s);
	if ($r.length === 1){
		$r.clone().attr('id', '_rf_highlight').prependTo('body').append(`
			<div id="_rf_header">
				<button id="_rf_closebtn">close recipe filter</button>
			</div>
		`).fadeIn(500);
		$('#_rf_closebtn').click(function(b){
			$('#_rf_highlight').fadeOut();
		});
		return false;
	}
	return true;
});
