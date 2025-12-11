// Disable TypeScript checking for this file
// (useful if the file is not strictly typed)
 // @ts-nocheck

// Get all required DOM elements from the HTML
const messagesDiv = document.getElementById("messages");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send");
const helpBtn = document.getElementById("helpBtn");
const clearBtn = document.getElementById("clearBtn");
const exitBtn = document.getElementById("exitBtn");
const quickHelp = document.getElementById("quickHelp");

// Load messages from localStorage.
// If nothing exists, initialize with a system message.
let messages = JSON.parse(localStorage.getItem("chat_messages") || "null") || [
  {
    role: "system",
    content:
      "You are a Helpful dailylife assistant bot. You help users with their daily life tasks and provide useful information. Be polite and concise in your responses."
  },
];

// Save only the last 30 messages into localStorage
function persist() {
  localStorage.setItem("chat_messages", JSON.stringify(messages.slice(-30)));
}

// Append a message (user/assistant) to the chat UI
function appendMessage(role, text, isTemporary = false) {
  const wrapper = document.createElement("div");              // message container
  wrapper.className = "message " + (role === "user" ? "msg-user" : "msg-assistant");

  const bubble = document.createElement("div");               // bubble container
  bubble.className = role === "user" ? "bubble-user" : "bubble-assistant";

  // Assistant messages may contain Markdown, so we parse + sanitize them
  if (role === "assistant") {
    try {
      const rawHtml = marked.parse(text || "");               // Convert Markdown → HTML
      const safeHtml = DOMPurify.sanitize(rawHtml);           // Sanitize HTML to prevent XSS
      const contentWrap = document.createElement("div");
      contentWrap.className = "md-content";
      contentWrap.innerHTML = safeHtml;                       // Insert safe HTML
      bubble.appendChild(contentWrap);
    } catch (e) {
      // If Markdown parsing fails, fall back to plain text
      const fallback = document.createElement("div");
      fallback.textContent = text || "";
      bubble.appendChild(fallback);
    }
  } else {
    // User messages shown as plain text (escaped by textContent)
    const textEl = document.createElement("div");
    textEl.className = "message-text";
    textEl.textContent = text || "";
    bubble.appendChild(textEl);
  }

  wrapper.appendChild(bubble);

  // For temporary elements (typing bubble), mark them so we can remove later
  if (isTemporary) wrapper.dataset.temporary = "1";

  // Add message to the chat window
  messagesDiv.appendChild(wrapper);

  // Always scroll to the bottom on new message
  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "smooth" });
}

// Show assistant typing indicator
function showTyping() {
  removeTemporaryAssistant();  // Remove existing typing bubbles

  const wrapper = document.createElement("div");
  wrapper.className = "message msg-assistant";
  wrapper.dataset.temporary = "1"; // mark as temporary

  const bubble = document.createElement("div");
  bubble.className = "typing-bubble";

  const dots = document.createElement("div");
  dots.className = "typing-dots";
  dots.setAttribute("aria-hidden", "true");

  // Create 3 animated dots
  for (let i = 0; i < 3; i++) {
    const s = document.createElement("span");
    dots.appendChild(s);
  }

  bubble.appendChild(dots);
  wrapper.appendChild(bubble);

  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "smooth" });
}

// Remove temporary typing indicators
function removeTemporaryAssistant() {
  const tmp = messagesDiv.querySelectorAll('[data-temporary="1"]');
  tmp.forEach(n => n.remove());
}

// Clear all messages and reset chat
function clearChat() {
  messages = [
    {
      role: "system",
      content:
        "You are a Helpful dailylife assistant bot. You help users with their daily life tasks and provide useful information. Be polite and concise in your responses."
    },
  ];

  localStorage.removeItem("chat_messages");   // Clear saved messages
  messagesDiv.innerHTML = "";                 // Clear visible chat

  appendMessage("assistant", "✅ Chat cleared! You can start fresh. How can I help you today?");
  persist();
}

// End chat and redirect to goodbye page
function exitChat() {
  appendMessage("assistant", "👋 Goodbye! Redirecting...");
  inputEl.disabled = true;
  sendBtn.disabled = true;

  setTimeout(() => {
    window.location.href = "/goodbye";        // Navigate away
  }, 1000);
}

// Main function that sends a user's message
async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;                          // Ignore empty messages

  // Built-in text commands
  const lc = text.toLowerCase();
  if (lc === "clear" || lc === "clear chat") {
    clearChat();
    inputEl.value = "";
    return;
  }
  if (lc === "exit" || lc === "quit") {
    exitChat();
    inputEl.value = "";
    return;
  }

  // Append user's message to UI and history
  appendMessage("user", text);
  messages.push({ role: "user", content: text });
  persist();
  inputEl.value = "";

  sendBtn.disabled = true;     // Disable button while awaiting response
  showTyping();                // Show assistant typing bubble

  try {
    // POST conversation history to backend /chat endpoint
    const resp = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await resp.json();

    removeTemporaryAssistant();  // Remove typing bubble
    sendBtn.disabled = false;    // Re-enable button

    // Server returned an error?
    if (data.error) {
      appendMessage("assistant", `Error: ${data.error}`);
    } else {
      // Normal reply
      const reply = data.reply || "";
      appendMessage("assistant", reply);
      messages.push({ role: "assistant", content: reply });
      persist();
    }
  } catch (err) {
    // Network errors + cleanup
    removeTemporaryAssistant();
    sendBtn.disabled = false;
    appendMessage("assistant", `Network error: ${err}`);
  }
}

// Event listeners for send button and Enter key
sendBtn.addEventListener("click", sendMessage);

inputEl.addEventListener("keydown", (e) => {
  // Enter = send ; Shift+Enter = newline
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Clear and Exit buttons
clearBtn.addEventListener("click", () => clearChat());
exitBtn.addEventListener("click", () => exitChat());

// Help button (optional)
helpBtn && helpBtn.addEventListener("click", () => {
  alert("Tip: Use Clear Chat (button) or type 'clear' to reset. Use Exit to end session.");
});

// Quick Help link (optional)
quickHelp && quickHelp.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Tip: Enter to send • Clear Chat clears the conversation • Exit goes to goodbye page.");
});

// Render messages from localStorage when page loads
function initialRender() {
  const show = messages.filter(m => m.role !== "system");   // Do not show system message
  show.forEach(m => appendMessage(m.role, m.content));       // Render each message
  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "auto" });
}

// Initialize chat UI
initialRender();
