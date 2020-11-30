chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // console.log('tabs.onUpdated');
    // console.log(changeInfo);
    // console.log(tab);

    // if (changeInfo.title)
    // if (tab.status === "complete")
    // if (tab.url.startsWith("https://www.youtube.com/") && 
    //     tab.url.includes("index=")) {
    //     console.log('run SizeInScreens.js on ' + tab.url);
    //     chrome.tabs.executeScript(null, {file:"SizeInScreens.js"});
    // }

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
