# 💬 DailyLife Assistant — Flask Chatbot (OpenAI / OpenRouter)

An intelligent, minimal, and responsive **AI chatbot web app** built using **Flask**, **HTML/CSS/JS**, and **OpenAI/OpenRouter API**.  
This project features a chat-style frontend, Markdown rendering, typing animation, and Docker/Vercel deployment support.

---

## 🚀 Features

✅ Conversational AI using OpenAI / OpenRouter API  
✅ Beautiful and responsive chat interface (mobile + desktop)  
✅ Markdown support (tables, lists, formatting)  
✅ Typing animation for assistant replies  
✅ Local chat persistence via browser storage  
✅ “Clear Chat” and “Exit” button with goodbye page  
✅ Fully Dockerized for easy cloud deployment (Vercel-ready)

---

## 🧱 Project Structure

```
Chat-bot/
│
├── main.py                # Flask backend + chat API routes
├── requirements.txt       # Python dependencies
├── Dockerfile             # Container configuration for deployment
├── start.sh               # Gunicorn startup script
├── .env                   # Local environment variables (excluded from git)
│
├── static/
│   └── chat.js            # Frontend chat logic (fetch, animations, localStorage)
│
├── templates/
│   ├── index.html         # Main chat UI
│   └── goodbye.html       # Exit/redirect page
│
└── README.md              # Project documentation
```

---

## ⚙️ Setup (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Chat-bot.git
cd Chat-bot
```

### 2. Create Virtual Environment (Python 3.11)
```bash
python -m venv venv
venv\Scripts\activate      # on Windows
source venv/bin/activate   # on Mac/Linux
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create `.env` File
Create a `.env` file in the project root with:
```bash
OPENAI_API_KEY="your-api-key-here"
OPENAI_BASE_URL="https://openrouter.ai/api/v1"
```

### 5. Run Locally
```bash
python main.py
```
Then open: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🐳 Docker Deployment

### Build the image:
```bash
docker build -t chatbot-flask .
```

### Run the container:
```bash
docker run --rm   -e OPENAI_API_KEY="your-api-key"   -e OPENAI_BASE_URL="https://openrouter.ai/api/v1"   -p 5000:5000 chatbot-flask
```

The chatbot will be available at:  
➡️ [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deploy on Vercel

This project is 100% compatible with **Vercel Docker Deployments**.

### Steps:
1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → *New Project* → Import your repo.
3. Framework preset: **Other** (not Flask).
4. Add these environment variables:

| Name | Value |
|------|--------|
| `OPENAI_API_KEY` | your key |
| `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` |
| `FLASK_SECRET` | any random string |
| `WEB_CONCURRENCY` | 3 |

5. Click **Deploy** 🎉

---

## 🖥️ Screenshots

### 💬 Chat Interface
![Chat Interface](https://via.placeholder.com/900x450?text=Chat+Interface)

### 👋 Goodbye Page
![Goodbye Page](https://via.placeholder.com/900x450?text=Goodbye+Page)

---

## 📜 License
This project is released under the **MIT License**.  
You can freely use, modify, and distribute it with attribution.

---

## ✨ Credits
Developed by **Sasidhar Kanakinti**  
Powered by [Flask](https://flask.palletsprojects.com/), [OpenRouter](https://openrouter.ai/), and [Vercel](https://vercel.com).
