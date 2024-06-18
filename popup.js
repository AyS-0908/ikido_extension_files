document.addEventListener('DOMContentLoaded', function() {
  const profileButton = document.getElementById('profileButton');
  const generateButton = document.getElementById('generateButton');
  const promptSection = document.getElementById('promptSection');

  profileButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'userProfile.html' });
  });

  chrome.storage.local.get('userProfile', (data) => {
    if (data.userProfile) {
      promptSection.style.display = 'block';
      // Initialize selectors with user's profile data
      initializeSelectors(data.userProfile);
    }
  });

  generateButton.addEventListener('click', () => {
    const classSelected = document.getElementById('classSelector').value;
    const subjectSelected = document.getElementById('subjectSelector').value;
    const objectiveSelected = document.getElementById('objectiveSelector').value;
    const needSelected = document.getElementById('needSelector').value;
    const languageSelected = document.getElementById('languageSelector').value;
    const details = document.getElementById('details').value;

    // Validate required fields
    if (!classSelected || !subjectSelected || !objectiveSelected || !needSelected || !languageSelected || !details) {
      alert('Please fill in all required fields.');
      return;
    }

    // Generate prompt based on the selections
    const prompt = generatePrompt(classSelected, subjectSelected, objectiveSelected, needSelected, languageSelected, details);
    console.log(prompt);
    // Here you can add functionality to copy the prompt to clipboard and open the chatbot
  });

  function initializeSelectors(profile) {
    // Populate selectors based on profile data
    // This function will dynamically populate the selectors with appropriate options
  }

  function generatePrompt(classSelected, subjectSelected, objectiveSelected, needSelected, languageSelected, details) {
    return `For class ${classSelected} and subject ${subjectSelected}, I want ${objectiveSelected}. Provide me with ${needSelected} in ${languageSelected} on the following topic: ${details}`;
  }
});
