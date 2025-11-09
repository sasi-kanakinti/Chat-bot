const messagesDiv = document.getElementById("messages");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send");
const helpBtn = document.getElementById("helpBtn");
const clearBtn = document.getElementById("clearBtn");
const exitBtn = document.getElementById("exitBtn");
const quickHelp = document.getElementById("quickHelp");

let messages = JSON.parse(localStorage.getItem("chat_messages") || "null") || [
  {
    role: "system",
    content:
      "You are a Helpful dailylife assistant bot. You help users with their daily life tasks and provide useful information. Be polite and concise in your responses."
  },
];

function persist() {
  localStorage.setItem("chat_messages", JSON.stringify(messages.slice(-30)));
}

function appendMessage(role, text, isTemporary = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "message " + (role === "user" ? "msg-user" : "msg-assistant");

  const bubble = document.createElement("div");
  bubble.className = role === "user" ? "bubble-user" : "bubble-assistant";

  if (role === "assistant") {
    try {
      const rawHtml = marked.parse(text || "");
      const safeHtml = DOMPurify.sanitize(rawHtml);
      const contentWrap = document.createElement("div");
      contentWrap.className = "md-content";
      contentWrap.innerHTML = safeHtml;
      bubble.appendChild(contentWrap);
    } catch (e) {
      const fallback = document.createElement("div");
      fallback.textContent = text || "";
      bubble.appendChild(fallback);
    }
  } else {
    const textEl = document.createElement("div");
    textEl.className = "message-text";
    textEl.textContent = text || "";
    bubble.appendChild(textEl);
  }

  wrapper.appendChild(bubble);
  if (isTemporary) wrapper.dataset.temporary = "1";
  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "smooth" });
}

function showTyping() {
  removeTemporaryAssistant();

  const wrapper = document.createElement("div");
  wrapper.className = "message msg-assistant";
  wrapper.dataset.temporary = "1";

  const bubble = document.createElement("div");
  bubble.className = "typing-bubble";

  const dots = document.createElement("div");
  dots.className = "typing-dots";
  dots.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 3; i++) {
    const s = document.createElement("span");
    dots.appendChild(s);
  }

  bubble.appendChild(dots);
  wrapper.appendChild(bubble);
  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "smooth" });
}

function removeTemporaryAssistant() {
  const tmp = messagesDiv.querySelectorAll('[data-temporary="1"]');
  tmp.forEach(n => n.remove());
}

function clearChat() {
  messages = [
    {
      role: "system",
      content:
        "You are a Helpful dailylife assistant bot. You help users with their daily life tasks and provide useful information. Be polite and concise in your responses."
    },
  ];
  localStorage.removeItem("chat_messages");
  messagesDiv.innerHTML = "";
  appendMessage("assistant", "✅ Chat cleared! You can start fresh. How can I help you today?");
  persist();
}

function exitChat() {
  appendMessage("assistant", "👋 Goodbye! Redirecting...");
  inputEl.disabled = true;
  sendBtn.disabled = true;
  setTimeout(() => {
    window.location.href = "/goodbye";
  }, 1000);
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

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

  appendMessage("user", text);
  messages.push({ role: "user", content: text });
  persist();
  inputEl.value = "";

  sendBtn.disabled = true;
  showTyping(); 

  try {
    const resp = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await resp.json();
    removeTemporaryAssistant();
    sendBtn.disabled = false;

    if (data.error) {
      appendMessage("assistant", `Error: ${data.error}`);
    } else {
      const reply = data.reply || "";
      appendMessage("assistant", reply);
      messages.push({ role: "assistant", content: reply });
      persist();
    }
  } catch (err) {
    removeTemporaryAssistant();
    sendBtn.disabled = false;
    appendMessage("assistant", `Network error: ${err}`);
  }
}

sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
clearBtn.addEventListener("click", () => clearChat());
exitBtn.addEventListener("click", () => exitChat());
helpBtn && helpBtn.addEventListener("click", () => {
  alert("Tip: Use Clear Chat (button) or type 'clear' to reset. Use Exit to end session.");
});
quickHelp && quickHelp.addEventListener("click", (e) => { e.preventDefault(); alert("Tip: Enter to send • Clear Chat clears the conversation • Exit goes to goodbye page."); });

function initialRender() {
  const show = messages.filter(m => m.role !== "system");
  show.forEach(m => appendMessage(m.role, m.content));
  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "auto" });
}
initialRender();
