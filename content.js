chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'pastePrompt') {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = request.prompt;
      }
    }
  });