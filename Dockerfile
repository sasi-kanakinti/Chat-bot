FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN python -m pip install --upgrade pip
RUN pip install -r /app/requirements.txt

COPY . /app

COPY start.sh /app/start.sh

RUN apt-get update && apt-get install -y dos2unix \
&& dos2unix /app/start.sh \
&& rm -rf /var/lib/apt/lists/*


RUN chmod +x /app/start.sh

RUN useradd --create-home appuser
USER appuser
ENV HOME=/home/appuser
ENV PYTHONUNBUFFERED=1

EXPOSE 5000
CMD ["/app/start.sh"]
