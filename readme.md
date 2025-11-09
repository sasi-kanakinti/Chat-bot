# 🧠 DailyLife Assistant Chatbot

A simple and intelligent **AI-powered chatbot** built using **Flask**, **OpenAI API (via OpenRouter)**, and a lightweight frontend interface.

🚀 **Live Demo:** [https://chat-bot-inky-omega-98.vercel.app/](https://chat-bot-inky-omega-98.vercel.app/)

---

## 📋 Features

- Conversational AI chatbot using OpenRouter's GPT models  
- Responsive UI built with HTML, CSS, and JavaScript  
- Markdown + HTML rendering for assistant responses  
- Chat history persisted in local storage  
- Clean "Goodbye" exit page  
- Fully containerized (Dockerfile & start.sh for deployment)

---

## 🛠️ Tech Stack

| Component | Technology |
|------------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Flask (Python) |
| **API Integration** | OpenAI API via OpenRouter |
| **Hosting** | Vercel (Production Deployment) |
| **Containerization** | Dockerfile with Gunicorn server |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root and add:

```bash
OPENAI_API_KEY=your_openrouter_api_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
WEB_CONCURRENCY=3
```

> ⚠️ Never commit your `.env` file to version control. Add it to `.gitignore`.

---

## ▶️ Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/sasi-kanakinti/Chat-bot.git
   cd Chat-bot
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # (Linux/macOS)
   venv\Scripts\activate    # (Windows)
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask app:
   ```bash
   python main.py
   ```

5. Open your browser and visit:  
   👉 **http://127.0.0.1:5000/**

---

## 🐳 Running via Docker

```bash
docker build -t chatbot-flask .
docker run -p 5000:5000 chatbot-flask
```

---

## 🧩 File Structure

```
Chat-bot/
├── main.py                # Flask application
├── start.sh               # Startup script for Gunicorn
├── requirements.txt       # Python dependencies
├── Dockerfile             # Docker container definition
├── templates/             # HTML templates (index.html, goodbye.html)
├── static/                # JavaScript and assets (chat.js, CSS)
├── .env                   # Environment variables (excluded from git)
└── README.md              # Project documentation
```

---

## 🌐 Deployment

The project is deployed using **Vercel** for Flask runtime:

🔗 **Live URL:** [https://chat-bot-inky-omega-98.vercel.app/](https://chat-bot-inky-omega-98.vercel.app/)

If you want to redeploy manually via CLI:
```bash
vercel --prod
```

---

## 🧠 Credits

- [OpenRouter](https://openrouter.ai/) – API gateway for GPT-based models  
- [Flask](https://flask.palletsprojects.com/) – Lightweight Python web framework  
- [Vercel](https://vercel.com/) – Hosting and CI/CD platform

---

## 📜 License

This project is open-source and available under the **MIT License**.
