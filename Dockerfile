FROM python:3.11-slim

WORKDIR /app

# Dependencies first so the layer caches across source edits.
COPY api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ src/
COPY api/ api/
COPY data/ data/
COPY index.html main.py ./
COPY css/ css/
COPY js/ js/
COPY img/ img/

ENV PYTHONPATH=/app/src
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
