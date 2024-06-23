import { addUserProfile } from './sheets.js';

document.addEventListener('DOMContentLoaded', function() {
  const saveProfileButton = document.getElementById('saveProfile');
  const roleSelector = document.getElementById('role');
  const countrySelector = document.getElementById('country');
  const classSelector = document.getElementById('class');
  const subjectSelector = document.getElementById('subject');
  const objectiveSelector = document.getElementById('objective');
  const needSelector = document.getElementById('need');
  const languageSelector = document.getElementById('language');

  chrome.storage.local.get('userProfile', (data) => {
    const language = data.userProfile ? data.userProfile.language : 'en';
    const strings = getLanguageStrings(language);
    document.querySelector('label[for="language"]').textContent = strings.languageLabel;
    document.querySelector('label[for="role"]').textContent = strings.roleLabel;
    document.querySelector('label[for="country"]').textContent = strings.countryLabel;
    document.querySelector('label[for="class"]').textContent = strings.classLabel;
    document.querySelector('label[for="subject"]').textContent = strings.subjectLabel;
    document.querySelector('label[for="town"]').textContent = strings.townLabel;
    document.querySelector('label[for="birthDate"]').textContent = strings.birthDateLabel;
    document.querySelector('label[for="gender"]').textContent = strings.genderLabel;
    document.querySelector('label[for="email"]').textContent = strings.emailLabel;
    saveProfileButton.textContent = strings.saveProfileButton;
  });

  chrome.storage.local.get('userProfile', (data) => {
    if (data.userProfile) {
      document.getElementById('language').value = data.userProfile.language;
      document.getElementById('role').value = data.userProfile.role;
      document.getElementById('country').value = data.userProfile.country;
      populateSelector('class', getClasses(data.userProfile.country, data.userProfile.role), data.userProfile.class);
      populateSelector('subject', getSubjects(data.userProfile.language), data.userProfile.subject);
      document.getElementById('town').value = data.userProfile.town;
      document.getElementById('birthDate').value = data.userProfile.birthDate;
      document.getElementById('gender').value = data.userProfile.gender;
      document.getElementById('email').value = data.userProfile.email;
    }
  });

  saveProfileButton.addEventListener('click', async () => {
    try {
      const profile = {
        language: document.getElementById('language').value,
        role: document.getElementById('role').value,
        country: document.getElementById('country').value,
        class: Array.from(document.getElementById('class').selectedOptions).map(option => option.value),
        subject: Array.from(document.getElementById('subject').selectedOptions).map(option => option.value),
        town: document.getElementById('town').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
      };

      if (!profile.language || !profile.role || !profile.country || profile.class.length === 0 || profile.subject.length === 0 || !profile.town || !profile.birthDate || !profile.gender || !profile.email) {
        showError('Please fill in all required fields.');
        return;
      }

      chrome.storage.local.set({ userProfile: profile }, async () => {
        try {
          await addUserProfile(profile);
          window.location.href = 'popup.html';
        } catch (error) {
          showError('Failed to save profile to Google Sheets');
        }
      });
    } catch (error) {
      showError('Failed to save profile');
    }
  });

  roleSelector.addEventListener('change', () => {
    initializeClassSelector(roleSelector.value);
    updateObjectiveSelector(roleSelector.value);
  });

  countrySelector.addEventListener('change', () => {
    populateSelector('class', getClasses(countrySelector.value, roleSelector.value));
  });

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 3000);
  }

  function initializeClassSelector(role) {
    if (role === 'teacher') {
      classSelector.setAttribute('multiple', 'multiple');
    } else {
      classSelector.removeAttribute('multiple');
    }
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

  function populateSelector(selectorId, options, selectedValues = []) {
    const selector = document.getElementById(selectorId);
    selector.innerHTML = '';
    options.forEach(option => {
      const opt = new Option(option, option);
      if (selectedValues.includes(option)) {
        opt.selected = true;
      }
      selector.appendChild(opt);
    });
  }

  function updateObjectiveSelector(role) {
    // Implementation of updateObjectiveSelector function
  }
});
