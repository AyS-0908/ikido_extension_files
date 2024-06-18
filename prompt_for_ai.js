document.getElementById('prompt-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    chrome.storage.local.get('profile', function(data) {
      const profile = data.profile;
      const promptDetails = {
        class: document.getElementById('class').value,
        subject: document.getElementById('subject').value,
        objective: document.getElementById('objective').value,
        need: document.getElementById('need').value,
        language_of_response: document.getElementById('language_of_response').value,
        details: document.getElementById('details').value
      };
  
      const prompt = generatePrompt(profile, promptDetails);
      copyToClipboard(prompt);
      openChatbotTab(profile.language, prompt);
    });
  });
  
  function generatePrompt(profile, details) {
    // Generate prompt based on profile and details
    return `Your generated prompt based on profile and details.`;
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Prompt copied to clipboard');
    });
  }
  
  function openChatbotTab(language, prompt) {
    let url = 'https://chatgpt.com/';
    if (language === 'fr') {
      url = 'https://chatgpt.com/fr';
    }
  
    chrome.tabs.create({ url }, function(tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (prompt) => {
          document.querySelector('textarea').value = prompt;
        },
        args: [prompt]
      });
    });
  }
  