document.addEventListener('DOMContentLoaded', function() {
    const saveProfileButton = document.getElementById('saveProfile');
  
    // Load profile if exists and initialize fields
    chrome.storage.local.get('userProfile', (data) => {
      if (data.userProfile) {
        document.getElementById('language').value = data.userProfile.language;
        document.getElementById('role').value = data.userProfile.role;
        document.getElementById('country').value = data.userProfile.country;
        const classOptions = document.getElementById('class').options;
        for (let option of classOptions) {
          if (data.userProfile.class.includes(option.value)) {
            option.selected = true;
          }
        }
        const subjectOptions = document.getElementById('subject').options;
        for (let option of subjectOptions) {
          if (data.userProfile.subject.includes(option.value)) {
            option.selected = true;
          }
        }
        document.getElementById('town').value = data.userProfile.town;
        document.getElementById('birthDate').value = data.userProfile.birthDate;
        document.getElementById('gender').value = data.userProfile.gender;
        document.getElementById('email').value = data.userProfile.email;
      }
    });
  
    saveProfileButton.addEventListener('click', () => {
      const profile = {
        language: document.getElementById('language').value,
        role: document.getElementById('role').value,
        country: document.getElementById('country').value,
        class: Array.from(document.getElementById('class').selectedOptions).map(option => option.value),
        subject: Array.from(document.getElementById('subject').selectedOptions).map(option => option.value),
        town: document.getElementById('town').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value
      };
  
      // Validate required fields
      if (!profile.language || !profile.role || !profile.country || !profile.class.length || !profile.subject.length || !profile.town || !profile.birthDate || !profile.gender || !profile.email) {
        alert('Please fill in all required fields.');
        return;
      }
  
      // Save profile to local storage
      chrome.storage.local.set({ userProfile: profile }, () => {
        console.log('Profile saved');
        chrome.tabs.create({ url: 'popup.html' });
      });
    });
  });
  