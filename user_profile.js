document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const profile = {
      language: document.getElementById('language').value,
      role: document.getElementById('role').value,
      country: document.getElementById('country').value,
      class: document.getElementById('class').value,
      subject: document.getElementById('subject').value,
      town: document.getElementById('town').value,
      birthDate: document.getElementById('birthDate').value,
      gender: document.getElementById('gender').value,
      email: document.getElementById('email').value
    };
  
    chrome.storage.local.set({ profile }, function() {
      console.log('Profile saved');
      window.location.href = 'prompt_for_ai.html';
    });
  });
  