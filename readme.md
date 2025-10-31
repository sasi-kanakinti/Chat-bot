# Chatbot (main.py)

Minimal command-line chatbot that uses the OpenAI-compatible client in [main.py](main.py).

Files:
- [main.py](main.py)
- [readme.md](readme.md)

Key symbols in the code:
- [`client`](main.py) — the OpenAI client instance used to call the chat API.
- [`messages`](main.py) — list that holds the conversation history.
- [`response`](main.py) — variable that holds the API response for each user input.

## Requirements

- Python 3.8+
- `openai` Python package (the script imports `OpenAI` from `openai`)
- An API key available as the `OPENAI_API_KEY` environment variable.

## Setup

1. Install dependencies:
```sh
pip install openai
```

2. Set your API key (example for Windows PowerShell):
```powershell
$env:OPENAI_API_KEY = "sk-..."
```

The script configures the client with:
- base URL: `https://openrouter.ai/api/v1`
- model: `gpt-4o` (set in [main.py](main.py))

## Usage

Run the chatbot:
```sh
python main.py
```

Type your messages when prompted. Type `exit` or `quit` (or press Enter) to end the conversation.

## Behavior

- Conversation history is stored in the [`messages`](main.py) list and sent on each request.
- Each assistant reply is appended back to [`messages`](main.py), preserving context.
- If an exception occurs during the request, the script prints the exception message.

## Notes & Troubleshooting

- Ensure `OPENAI_API_KEY` is set and valid for the `base_url` you use.
- If you receive network or authentication errors, confirm the `base_url` and API key are correct.
- To change the model or request parameters edit [main.py](main.py).
