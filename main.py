import os
import logging
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import requests

# Load .env
load_dotenv()

# Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

# Load environment variables
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")

if not OPENROUTER_API_KEY:
    logging.error("OPENROUTER_API_KEY not set. API calls will fail.")
else:
    logging.info("OpenRouter API key loaded.")

# Correct OpenRouter client setup
client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url=OPENAI_BASE_URL,
    default_headers={
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "DailyLife Assistant",
    }
)

SYSTEM_MESSAGE = {
    "role": "system",
    "content": (
        "You are a Helpful daily-life assistant bot. You help users with everyday tasks "
        "and provide useful, polite, concise information."
    ),
}

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/goodbye")
def goodbye():
    return render_template("goodbye.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/chat", methods=["POST"])
def chat():
    """
    Expects JSON: { "messages": [ {role, content}, ... ] }
    Returns: { "reply": "<assistant reply>" }
    """
    data = request.get_json(silent=True)
    if data is None:
        logging.warning("No JSON body received.")
        return jsonify({"error": "Missing or invalid JSON body"}), 400

    messages = data.get("messages", [])

    if not messages or messages[0].get("role") != "system":
        messages = [SYSTEM_MESSAGE] + messages

    logging.info(f"Forwarding chat request; messages count={len(messages)}")

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b:free",
            messages=messages
        )

        assistant_text = response.choices[0].message.content or ""
        logging.info(f"Received reply length={len(assistant_text)}")

        return jsonify({"reply": assistant_text})

    except requests.exceptions.Timeout:
        logging.exception("Upstream timeout occurred.")
        return jsonify({"error": "Upstream timeout from OpenRouter"}), 504

    except Exception as e:
        logging.exception("Error while calling OpenRouter API.")
        return jsonify({"error": "Server error contacting model: " + str(e)}), 502


# Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)