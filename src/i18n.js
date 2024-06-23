const languageStrings = {
    en: {
      profileButton: "Profile",
      generateButton: "Generate Prompt",
      classLabel: "Class",
      subjectLabel: "Subject",
      objectiveLabel: "Objective",
      needLabel: "Need",
      languageLabel: "Response Language",
      detailsPlaceholder: "Enter details...",
      saveProfileButton: "Save Profile"
      // Add other strings as needed
    },
    fr: {
      profileButton: "Profil",
      generateButton: "Générer une invite",
      classLabel: "Classe",
      subjectLabel: "Matière",
      objectiveLabel: "Objectif",
      needLabel: "Besoin",
      languageLabel: "Langue de réponse",
      detailsPlaceholder: "Entrez les détails...",
      saveProfileButton: "Enregistrer le profil"
      // Add other strings as needed
    }
  };
  
  function getLanguageStrings(language) {
    return languageStrings[language] || languageStrings.en;
  }
  