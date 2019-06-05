function remove(e){
	chrome.storage.sync.remove(e.target.id, function(){
		e.target.parentElement.parentElement.removeChild(e.target.parentElement)
	});
}

chrome.storage.sync.get(null, function(data){
	let rowMarkup = '';
	let selectors = [];

	for (site in data) {
		rowMarkup += `<tr>
			<td id="${site}" class="trash-cell" style="cursor:pointer;">&#9447;</td>
			<td>${site}</td>
		</tr>`;
		selectors.push(`[id="${site}"]`);
	}
	document.querySelector('#blacklist tbody').innerHTML = rowMarkup;
	document.querySelectorAll(selectors.join(',')).forEach((td) => {
		td.addEventListener('click', remove);
	});
});
