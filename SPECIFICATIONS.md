
# Extension Specifications v1.1 – 21st June 2024

---

## **Context and Objective**

1. **Context**: 
   - Google Chrome Extension
   - Semi-automates Prompt creation
   - User selects options in predefined selectors
   - Creates a prompt based on template filled by user’s selections
   - Copy-pastes prompt in AI chatbot (e.g., ChatGPT, Perplexity.ai, Google Gemini)

2. **Objective**: 
   - Present two user stories (US_1 and US_2) and related coding notes
   - Example of application of US_1 and US_2
   - Technical considerations for coding the extension

---

## **User Stories and Notes for Coding**

1. **User Story 1 (US_1): User Profile Screen**
   - **US_1-1**: User discovers the interface
     - **USER_LANGUAGE Button**: User selects language option (Français or English)
       - System action: Changes interface language and displays introduction text
     - **Introduction Text**: Display text based on selected language
   - **US_1-2**: User completes their profile
     - **ROLE Selector**: User selects one option (Student or Teacher)
     - **COUNTRY Selector**: User selects one option (Country options)
     - **CLASS Selector**: User selects option(s) based on role and country
     - **SUBJECTS Selector**: User selects multiple options (Subjects list)
     - **TOWN Entry**: User enters town
     - **BIRTHDATE Entry**: User enters birth date (DD/MM/YYYY)
     - **GENDER Selector**: User selects gender (Woman or Man)
     - **EMAIL Entry**: User enters email
   - **US_1-3**: User is redirected to ‘Prompt for AI’ screen
     - **VALIDATE Button**: Submits profile, saves to local storage, adds row in Google Sheet, redirects to ‘Prompt for AI’

2. **User Story 2 (US_2): Prompt for AI Screen**
   - **US_2-1**: User selects options
     - **CLASS Selector**: User selects class
     - **SUBJECT Selector**: User selects subject
     - **OBJECTIVE Selector**: User selects objective (Narrowed by role)
     - **NEED Selector**: User selects need (Narrowed by objective)
     - **RESPONSE_LANGUAGE Selector**: User selects response language (Narrowed by subject and user language)
     - **DETAILS Entry**: User enters specific details of request
   - **US_2-2**: Customized editable prompt created
     - **PROMPT_CREATION Button**: Validates to get the customized prompt
     - **Prompt Template filled**: Based on user language and selections
   - **US_2-3**: Prompt pasted in external chatbot
     - **LAUNCH_AI Button**: Validates prompt, copies it, opens chatbot URL, pastes prompt, increments Google Sheet

---

## **Selectors’ Dependencies**

- **US_2-1_E (Response Language)**: Narrowed by US_1-1_A (User Language) and US_2-1_B (Subject)
- **US_1-2_C (Class)**: Narrowed by US_1-2_B (Country)
- **US_2-1_A (Class)**: Narrowed by US_1-2_C (Class)
- **US_2-1_B (Subject)**: Narrowed by US_1-2_D (Subject)
- **US_2-1_C (Objective)**: Narrowed by US_1-2_A (Role)
- **US_2-1_D (Need)**: Narrowed by US_2-1_C (Objective)
- **US_2-3_A (Short Prompt)**: Narrowed by US_2-1_D (Need)
- **US_2-1_D (Chatbot URL)**: Narrowed by US_2-1_D (Need)

---

## **Example Output of User Story 2**

1. **User’s Selections and Entries**:
   - **US_1**: 
     - Language: Français
     - Role: Professeur
     - Country: France
     - Class: 3ème and 4ème
     - Subject: Maths, English, Histoire
   - **US_2**: 
     - Class: 3ème
     - Subject: Histoire
     - Objective: Création de cours
     - Needs: des Données chiffrées
     - Response language: Français
     - Details: 2nde guerre mondiale

2. **Prompt Automatically Created**:
   - Role: Teacher in France, teaches "Histoire" in "3ème" class, known for pedagogy
   - Task: Assist "Professeur" with "Création de cours", provide "des Données chiffrées" on "2nde guerre mondiale"
   - Instructions: Ask for clarifications, prepare step-by-step, write best answer
   - Answer Format: Language: Français, Structure: Paragraphs with headings in markdown
   - Important: Take time, be precise and pedagogical

---

## **Technical Considerations**

1. **Data Storage**:
   - No database
   - Selectors’ options and prompt templates hardcoded
   - User profile stored in browser’s local storage

2. **Code Quality**:
   - Manifest v3
   - Load time within 2 seconds
   - 200 simultaneous users without performance degradation
   - Minimal memory and CPU usage
   - 99.9% uptime
   - Code reviews for compliance and best practices

3. **Code Error Handling**:
   - Input validation for mandatory fields
   - Retry logic for network errors
   - Handle storage limits
   - Update selectors’ options correctly
   - Handle network errors for prompt creation
   - Loading time feedback and concurrency handling
   - Global error handler and user issue reporting