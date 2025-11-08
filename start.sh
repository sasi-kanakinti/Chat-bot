PORT="${PORT:-5000}"
WORKERS="${WEB_CONCURRENCY:-3}"
exec gunicorn --workers "$WORKERS" --bind "0.0.0.0:${PORT}" main:app
