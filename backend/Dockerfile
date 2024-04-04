FROM python:3.11-alpine
EXPOSE 8000
WORKDIR /app
RUN pip install --no-cache-dir --upgrade poetry
COPY pyproject.toml poetry.lock ./
RUN poetry install --only main
COPY . .
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
