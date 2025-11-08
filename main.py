import os
import logging
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import requests

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")

if not OPENAI_API_KEY:
    logging.warning("OPENAI_API_KEY not set. API calls will fail until it's configured.")

client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

SYSTEM_MESSAGE = {
    "role": "system",
    "content": (
        "You are a Helpful dailylife assistant bot. You help users with their daily life tasks "
        "and provide useful information. Be polite and concise in your responses."
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
    Returns: { "reply": "<assistant content as received (markdown/html)>" }
    """
    data = request.get_json(silent=True)
    if data is None:
        logging.warning("No JSON body received")
        return jsonify({"error": "Missing or invalid JSON body"}), 400

    messages = data.get("messages", [])
    if not messages or messages[0].get("role") != "system":
        messages = [SYSTEM_MESSAGE] + messages

    logging.info("Forwarding chat request; messages count=%d", len(messages))

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b:free",
            messages=messages
        )
        assistant_text = response.choices[0].message.content or ""
        logging.info("Received reply length=%d", len(assistant_text))
        return jsonify({"reply": assistant_text})
    except requests.exceptions.Timeout:
        logging.exception("Upstream timeout")
        return jsonify({"error": "Upstream timeout from OpenAI/OpenRouter"}), 504
    except Exception as e:
        logging.exception("Error while calling OpenAI/OpenRouter")
        return jsonify({"error": "Server error contacting the model: " + str(e)}), 502


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
