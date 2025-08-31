# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    tesseract-ocr \
    libtesseract-dev \
    poppler-utils \
    git \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy entrypoint script and set permissions as root
COPY entryPoint.sh /app/entryPoint.sh
RUN chmod +x /app/entryPoint.sh

# Copy application code
COPY . .

# Create a non-root user for security
RUN useradd -m -u 1000 flaskuser && chown -R flaskuser:flaskuser /app
USER flaskuser

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=run.py
ENV FLASK_ENV=production

# Set entrypoint and default command
ENTRYPOINT ["/app/entryPoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "run:app"]