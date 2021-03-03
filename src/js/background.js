chrome.contextMenus.create({
 id: "reshow-popup",
 title: "Reshow Popup",
 contexts:["browser_action"],
 onclick: function () {
   //Send message to active tab's content script
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
     chrome.tabs.sendMessage(tabs[0].id, {action: "reshow_popup"});
   });
 }
});
