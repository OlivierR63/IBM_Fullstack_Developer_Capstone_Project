FROM python:3.9.18-slim-bookworm

# Define the working directory
WORKDIR /app

# Only copy the dependency configuration file to optimize the Docker cache.
COPY requirements.txt requirements.txt

# Install dependencies
RUN pip3 install -r requirements.txt

# Define the Flask application (essential for "flask run" command)
ENV FLASK_APP=app.py

# Copy the rest of the source code (including app.py)
COPY . .

# Command to start the application on the port 5000
# Remark: Using Gunicorn or uWSGI is recommended for production deployments.
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=5000"]

