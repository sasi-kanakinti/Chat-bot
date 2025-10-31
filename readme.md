# Chatbot (main.py)

Minimal command-line chatbot that uses an OpenAI-compatible client to send a short conversation history and receive assistant replies.

Files

- main.py — CLI chatbot implementation (uses the OpenAI Python client).
- requirements.txt — runtime dependency (openai).
- .gitignore — recommended ignores for the repo.
- readme.md — this file.

Quick summary

- The script constructs an OpenAI client (base_url set to https://openrouter.ai/api/v1) and uses model gpt-4o.
- Conversation history is kept in the messages list and sent with each request so the assistant preserves context.

Requirements

- Python 3.8+
- Dependencies: see requirements.txt (openai>=1.0.0)
- An API key available as the OPENAI_API_KEY environment variable.

Setup

1. Create a virtual environment (recommended):
   Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Set your API key (example for Windows PowerShell):

```powershell
$env:OPENAI_API_KEY = "sk-..."
```

Or Windows Command Prompt:

```cmd
set OPENAI_API_KEY=sk-...
```

Configuration

- Default base_url is set in main.py to: https://openrouter.ai/api/v1
- Default model used in main.py: "gpt-4o"
- To change the model or base_url edit the client creation and the model parameter in main.py.

Usage
Run the chatbot:

```powershell
python main.py
```

- Type messages at the "User:" prompt.
- Type `exit` or `quit` (or press Enter on an empty line) to end the conversation.

Behavior notes

- messages list starts with a system prompt (see main.py) and is appended with each user and assistant turn.
- Each assistant reply is printed and appended to messages, preserving context for subsequent turns.
- Errors during API calls are printed to stdout.

Security / git tips

- Do NOT commit secrets or .env files. The provided .gitignore contains common entries (virtual env folders, .env, credentials files).
- Keep your OPENAI_API_KEY private and rotate it if it is ever exposed.

Troubleshooting

- Authentication errors: verify OPENAI_API_KEY and base_url.
- Network errors: check connectivity and firewall settings.
- If the client package API changes, consult the installed openai package docs or update the code accordingly.

License

- No license file included. Add a LICENSE file if you plan to publish the project.
