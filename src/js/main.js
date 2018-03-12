recipe_selector_groups = [
	['.recipe-callout'],
	['.tasty-recipes'],
	['.main-header', '.ingredients', '.article-content'], // forksoverknives.com
	['.recipe-summary.wide'], // thepioneerwoman.com
	['.easyrecipe'],
	['.innerrecipe'],
	['.wprm-recipe-container'],
	['.recipe-content'],
	['div[itemtype="http://schema.org/Recipe"]'],
	['div[itemtype="https://schema.org/Recipe"]'],
]


function hidePopup() {
    $('#_rf_highlight_container').fadeOut();
}

function showPopup(){
	recipe_selector_groups.every(function(recipe_selector_group){
        var results = recipe_selector_group
                    .map(selector => $(selector))
                    .filter($result => $result.length === 1);
        if (results.length === recipe_selector_group.length) {
            // prepend the container popup div to <body>
            $('body').prepend(`
                <div id="_rf_highlight_container"></div>
            `);

            // clone the matched elements into the popup (while maintaining the selector ordering)
            const last_element_id = results.length - 1;
            for (var i = last_element_id; i >= 0; i--) {
                results[i].clone().attr('id', '_rf_highlight' + i).prependTo('div#_rf_highlight_container');
            }

            // add some control buttons to the popup
            $('#_rf_highlight' + last_element_id).append(`
                <div id="_rf_header">
                    <button id="_rf_closebtn" class="_rfbtn">close recipe</button>
                    RecipeFilter
                    <button id="_rf_disablebtn" class="_rfbtn">disable on this site</button>
                </div>
            `).fadeIn(500);

            // register click handlers for the control buttons we attached to the popup
            $('#_rf_closebtn').click(hidePopup);
            $('#_rf_disablebtn').click(function(b){
                chrome.storage.sync.set({[document.location.hostname]: true}, hidePopup);
            });

			// add an event listener for clicking outside the popup to close it
			$(document).mouseup(function(e) {
				var container = $('#_rf_highlight_container');
				if (!container.is(e.target) && container.has(e.target).length === 0)
				{
				    hidePopup();
				    $(document).unbind('mouseup');
				}
			});

			// scroll to top in case they hit refresh while lower in page
			$(window).scrollTop(0);

			// it worked, stop iterating through recipe_selector_groups
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
