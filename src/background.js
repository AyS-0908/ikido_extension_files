chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
  chrome.storage.local.set({apiKey: 'YOUR_ACTUAL_API_KEY'}, function() {
    console.log('API key saved');
  });
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension Started");
});