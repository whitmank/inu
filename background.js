// Declare global variable to cache urls as they're saved
let cachedUrls = [];

// Initialize cache when the extension runs.
// runtime.onInstalled >> extension first installed, updated, or Chrome is started
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get({ urls: [] }, (result) => {
        cachedUrls = result.urls;
        console.log('URL Cache initialized:', cachedUrls);
    });
});

// Provide a way for popup.js to access the cache
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getCachedUrls') {
        sendResponse({ urls: cachedUrls });
    } else if (request.type === 'updateCachedUrls') {
        cachedUrls.push(request.url);
        chrome.storage.local.set({ urls: cachedUrls }, () => {
            console.log('URL saved:', request.url);
            sendResponse({ status: 'success' });
        });
    }
    // Ensure sendResponse is called asynchronously if required
    return true;
});