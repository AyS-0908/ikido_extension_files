chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "pastePrompt") {
    const chatField = document.querySelector('textarea'); // Adjust selector based on the chatbot
    if (chatField) {
      chatField.value = request.prompt;
      const event = new Event('input', { bubbles: true });
      chatField.dispatchEvent(event);
      sendResponse({ status: "success" });
    } else {
      sendResponse({ status: "failure", message: "Chat field not found" });
    }
  }
});
