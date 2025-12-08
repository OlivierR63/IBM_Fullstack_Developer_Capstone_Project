# Uncomment the imports below before you add the function code
import requests
import inspect
import json
import os
import logging

logger = logging.getLogger(__name__)

backend_url = os.getenv(
    'BACKEND_URL', default="http://localhost:3030")
logger.info(f"DEBUG: backend_url = {backend_url}")

sentiment_analyzer_url = os.getenv(
    'SENTIMENT_URL',
    default="http://localhost:5050/")
logger.info(f"DEBUG: sentiment_analyzer_url = {sentiment_analyzer_url}")

searchcars_url = os.getenv(
    'SEARCHCARS_URL',
    default="http://localhost:3050/")
logger.info(f"DEBUG: searchcars_url = {searchcars_url}")



def get_request(endpoint, **kwargs):
    params = ""
    if (kwargs):
        for key, value in kwargs.items():
            params = params + key + "=" + value + "&"

    request_url = backend_url + endpoint + "?" + params
    logger.info(f"DEBUG: GET from {request_url}")

    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        
         # Check if the response is not empty and is a valid JSON
        if response.text:
            return response.json()
        else:
            logger.error("ERROR: Empty response received")
            return None
    except json.JSONDecodeError:
        logger.error("ERROR: Response is not a valid JSON")
    except Exception as err:
        current_function_name = inspect.currentframe().f_code.co_name
        logger.error(f"ERROR: Unexpected error in {current_function_name}")
        logger.error(f"ERROR: Unexpected {err=}, {type(err)=}")
        logger.error("ERROR: Network exception occurred")


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        current_function_name = inspect.currentframe().f_code.co_name
        logger.error(f"ERROR: Unexpected error in {current_function_name}")
        logger.error(f"ERROR: Unexpected {err=}, {type(err)=}")
        logger.error("ERROR: Network exception occurred")


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    logger.debug(f"DEBUG: request_url = {request_url}")
    try:
        response = requests.post(request_url, json=data_dict)
        return response.json()
    except Exception as err:
        current_function_name = inspect.currentframe().f_code.co_name
        logger.error(f"ERROR: Unexpected error in {current_function_name}")
        logger.error(f"ERROR: Unexpected {err=}, {type(err)=}")
        logger.error("ERROR: Network exception occurred")
        return {"status": 503, "message": "Backend service unavailable or network error"}


def searchcars_request(endpoint, **kwargs):
    params = ""
    if (kwargs):
        for key, value in kwargs.items():
            params = params + key + "=" + value + "&"

    request_url = searchcars_url + endpoint + "?" + params

    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        current_function_name = inspect.currentframe().f_code.co_name
        logger.error(f"ERROR: Unexpected error in {current_function_name}")
        logger.error(f"ERROR: Unexpected {err=}, {type(err)=}")
        logger.error("ERROR: Network exception occurred")
