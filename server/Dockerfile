    FROM python:3.12.0-slim-bookworm

    ENV PYTHONBUFFERED=1
    ENV PYTHONWRITEBYTECODE=1

    ENV APP=/app

    # Change the workdir.
    WORKDIR $APP

    # Install the requirements (Docker cache layer)
    COPY requirements.txt $APP
    RUN pip3 install -r requirements.txt

    # Copy the rest of the files (source code, settings, entrypoint.sh)
    COPY . $APP
    RUN chmod +x /app/entrypoint.sh

    EXPOSE 8000

    # Define the entry points
    ENTRYPOINT ["/bin/bash","/app/entrypoint.sh"]

    # Default command (the Unicorn production server)
    #CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
    CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]