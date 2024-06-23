import { incrementRequestCount } from './sheets.js';

document.addEventListener('DOMContentLoaded', function() {
  const profileButton = document.getElementById('profileButton');
  const generateButton = document.getElementById('generateButton');
  const promptSection = document.getElementById('promptSection');
  const loadingIndicator = document.getElementById('loadingIndicator');

  profileButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'user_profile.html' });
  });

  chrome.storage.local.get('userProfile', (data) => {
    const language = data.userProfile ? data.userProfile.language : 'en';
    const strings = getLanguageStrings(language);
    document.getElementById('profileButton').textContent = strings.profileButton;
    document.getElementById('generateButton').textContent = strings.generateButton;
    document.getElementById('classSelector').placeholder = strings.classLabel;
    document.getElementById('subjectSelector').placeholder = strings.subjectLabel;
    document.getElementById('objectiveSelector').placeholder = strings.objectiveLabel;
    document.getElementById('needSelector').placeholder = strings.needLabel;
    document.getElementById('languageSelector').placeholder = strings.languageLabel;
    document.getElementById('details').placeholder = strings.detailsPlaceholder;
  });

  chrome.storage.local.get('userProfile', (data) => {
    if (!data.userProfile) {
      chrome.tabs.create({ url: 'user_profile.html' });
    } else {
      promptSection.style.display = 'block';
      initializeSelectors(data.userProfile);
    }
  });

  generateButton.addEventListener('click', async () => {
    const classSelected = document.getElementById('classSelector').value;
    const subjectSelected = document.getElementById('subjectSelector').value;
    const objectiveSelected = document.getElementById('objectiveSelector').value;
    const needSelected = document.getElementById('needSelector').value;
    const languageSelected = document.getElementById('languageSelector').value;
    const details = document.getElementById('details').value;

    if (!classSelected || !subjectSelected || !objectiveSelected || !needSelected || !languageSelected || !details) {
      showError('Please fill in all required fields.');
      return;
    }

    loadingIndicator.style.display = 'block';

    const prompt = generatePrompt(classSelected, subjectSelected, objectiveSelected, needSelected, languageSelected, details);
    copyToClipboard(prompt);

    chrome.storage.local.get('userProfile', async (data) => {
      if (data.userProfile && data.userProfile.email) {
        try {
          await incrementRequestCount(data.userProfile.email);
        } catch (error) {
          console.error('Failed to increment request count:', error);
        }
      }
    });

    openChatbotAndPastePrompt(prompt, needSelected);
  });

  function generatePrompt(classSelected, subjectSelected, objectiveSelected, needSelected, languageSelected, details) {
    const shortPrompts = {
      "a simplified Explanation": "clear, pedagogical and adapted simplified explanation for the student's class. Use practical examples to illustrate concepts",
      "a detailed Summary": "a summary covering the key points of the lesson and including examples for each point. Concludes with a concise list of the 5 KEY POINTS TO REMEMBER. Ensure your response is well-structured and easy to understand for a student of the student's class",
      "some common Mistakes": "frequent mistakes students make on the subject. For each mistake, provide an explanation of why it is common and how to avoid it. Use concrete examples to clarify",
      "some Mnemonic Tricks": "mnemonic techniques to help memorize key concepts of the subject (these can be dates, rules, definitions, theorems, formulas, etc.). Each trick should be simple, easy to remember, and effective for a student of the student's class",
      "a Multiple Choice Quiz": "a multiple-choice quiz on the subject with 10 questions. Each question should have 4 possible answers, with only one correct. Questions should cover the main points of the lesson and vary in difficulty"
    };

    const shortPrompt = shortPrompts[needSelected] || "";
    const promptTemplate = `
# YOUR ROLE: 
- You are a teacher in ${classSelected}.  
- You teach the subject "${subjectSelected}" in a ${classSelected} class. 
- You're known for your pedagogy and your perfect mastery of the subject.

# YOUR TASK:  
You assist a "${objectiveSelected}" whose objective is : "${objectiveSelected}". 
You must provide them with "${needSelected}" on this subject: ${details}. 

# YOUR INSTRUCTIONS: 
Ask questions if you need clarification and wait for the answer. 
Then proceed step by step, writing only step 3: 
- Step 1: Silently prepare "${shortPrompt}".  
- Step 2: Silently rate your answer relevance and pedagogy from 1 to 5. Then correct it until you rate it 5/5. 
- Step 3: Write your best answer. 

# YOUR ANSWER FORMAT:  
- Language: ${languageSelected}. 
- Structure: paragraph with headings and formatted in markdown. 

# IMPORTANT: 
This query is very important for the "${objectiveSelected}": you'll be rewarded for a more 
**PRECISE** and **PEDAGOGICAL** answer than other LLMs.  
So make sure you take time to think and proceed step by step.
`;
    return promptTemplate.trim();
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }

  function openChatbotAndPastePrompt(prompt, needSelected) {
    const chatbotUrls = {
      "a simplified Explanation": "https://chatgpt.com/?model=gpt-4o",
      "a detailed Summary": "https://chatgpt.com/?model=gpt-4o",
      "some common Mistakes": "https://chatgpt.com/?model=gpt-4o",
      "some Mnemonic Tricks": "https://chatgpt.com/?model=gpt-4o",
      "a Multiple Choice Quiz": "https://chatgpt.com/?model=gpt-4o",
      "some Information Sources": "https://www.perplexity.ai/",
      "some Numerical Data": "https://www.perplexity.ai/"
    };

    const chatbotUrl = chatbotUrls[needSelected] || "https://chatgpt.com/?model=gpt-4o";
    chrome.tabs.create({ url: chatbotUrl }, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (prompt) => {
          const textarea = document.querySelector('textarea');
          if (textarea) {
            textarea.value = prompt;
          }
        },
        args: [prompt]
      }, () => {
        loadingIndicator.style.display = 'none';

        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: 'Prompt Pasted',
          message: 'Press Enter once the prompt is pasted in the AI chatbot.'
        });
      });
    });
  }

  function initializeSelectors(profile) {
    const classOptions = getClasses(profile.country, profile.role);
    const subjectOptions = getSubjects(profile.language);
    const objectiveOptions = getObjectives(profile.role);
    const needOptions = getNeeds();

    populateSelector('classSelector', classOptions);
    populateSelector('subjectSelector', subjectOptions);
    populateSelector('objectiveSelector', objectiveOptions);
    populateSelector('needSelector', needOptions);
  }

  function getClasses(country, role) {
    const classes = {
      "United States": ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"],
      "France": ["Petite section", "Moyenne section", "Grande section", "CP", "CE1", "CE2", "CM1", "CM2", "6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"]
    };
    return classes[country] || [];
  }

  function getSubjects(language) {
    const subjects = {
      "en": ["Mathematics", "History", "Science", "Geography", "Literature", "Art", "Music", "Physical Education"],
      "fr": ["Mathématiques", "Histoire", "Sciences", "Géographie", "Littérature", "Art", "Musique", "Éducation physique"]
    };
    return subjects[language] || [];
  }

  function getObjectives(role) {
    const objectives = {
      "Student": ["Learn a Lesson", "Information Retrieval", "Assignment Completion"],
      "Teacher": ["Course Creation", "Fun Activities", "Course Evaluation"]
    };
    return objectives[role] || [];
  }

  function getNeeds() {
    return ["a simplified Explanation", "a detailed Summary", "some common Mistakes", "some Mnemonic Tricks", "a Multiple Choice Quiz"];
  }

  function populateSelector(selectorId, options) {
    const selector = document.getElementById(selectorId);
    selector.innerHTML = '';
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      selector.appendChild(opt);
    });
  }

  function getLanguageStrings(language) {
    const strings = {
      en: {
        profileButton: 'Profile',
        generateButton: 'Generate Prompt',
        classLabel: 'Class',
        subjectLabel: 'Subject',
        objectiveLabel: 'Objective',
        needLabel: 'Need',
        languageLabel: 'Language',
        detailsPlaceholder: 'Enter details...'
      },
      fr: {
        profileButton: 'Profil',
        generateButton: 'Générer l\'invite',
        classLabel: 'Classe',
        subjectLabel: 'Sujet',
        objectiveLabel: 'Objectif',
        needLabel: 'Besoin',
        languageLabel: 'Langue',
        detailsPlaceholder: 'Entrez les détails...'
      }
    };
    return strings[language] || strings.en;
  }
});
