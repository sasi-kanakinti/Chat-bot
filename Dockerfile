FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends build-essential dos2unix \
  && python -m pip install --upgrade pip \
  && pip install -r requirements.txt \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .
RUN dos2unix start.sh && chmod +x start.sh

RUN useradd --create-home appuser
USER appuser

EXPOSE 5000

CMD ["./start.sh"]
