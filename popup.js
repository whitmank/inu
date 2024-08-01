// Save URL of current page.
document.getElementById('saveUrlButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;

        // Retrieve existing URLS from storage or initialize an empty array
        chrome.storage.local.get({ urls: [] }, (result) => {
            const urls = result.urls;

            // Add new URL
            urls.push(url);

            // Save updated list back to storage
            chrome.storage.local.set({ urls: urls }, () => {
                console.log('URL saved:', url);
            });
        });

        // Update cache in the background script
        chrome.runtime.sendMessage({ type: 'updateCachedUrls', url: url }, (response) => {
            if (response.status === 'success') {
                console.log('URL saved:', url);
            } else {
                console.log('Failed to save URL');
            }
        });

        // Load cached URL's when the popup is opened
        chrome.runtime.sendMessage({ type: 'getCachedUrls' }, (response) => {
            console.log('Cached URLs:', response.urls);


        })
    });
});


// Features:
// Save current page
// Save selected pages (and create group)
// Save all pages in window