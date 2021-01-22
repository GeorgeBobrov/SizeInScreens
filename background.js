var idSizeInScreensAddresses = 'SizeInScreensAddresses';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // console.log('tabs.onUpdated');
    // console.log(new Date().toISOString());      
    // console.log(tab);
    // console.log(changeInfo);
    // console.log("---------------");
 
    if (changeInfo.status === "complete")
    if (tab.status === "complete") {
    // console.log(changeInfo);      
    // console.log(tab);
        chrome.storage.local.get([idSizeInScreensAddresses], function(data) {
            let readAddresses = data[idSizeInScreensAddresses];
            for (const addr of readAddresses)
                if (tab.url.startsWith(addr)) {
                    console.log(addr);
                    console.log('run SizeInScreens.js on ' + tab.url);
                    chrome.tabs.executeScript(tabId, {file:"SizeInScreens.js"});
                    break;
                }    
        });             
    }

});


chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create({
        id: "SizeInScreens",
        title: "SizeInScreens",
    }, function() {
        console.log("contextMenus.create", chrome.runtime.lastError);
    });

});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
        chrome.tabs.executeScript(null, {file:"SizeInScreens.js"});
}); 

// Log all items in chrome.storage.local for this extension
// chrome.storage.local.get(null, function (Items) {console.log(Items)});