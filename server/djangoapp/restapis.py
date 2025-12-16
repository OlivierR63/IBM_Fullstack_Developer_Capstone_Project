# Uncomment the imports below before you add the function code
import requests
import inspect
import json
import os
import logging

logger = logging.getLogger(__name__)

backend_url = os.getenv(
    'BACKEND_URL', default="http://database_api:3030")
logger.info(f"DEBUG: backend_url = {backend_url}")

sentiment_analyzer_url = os.getenv(
    'SENTIMENT_URL',
    default="http://sentiment_analyzer:5000/")
logger.info(f"DEBUG: sentiment_analyzer_url = {sentiment_analyzer_url}")

searchcars_url = os.getenv(
    'SEARCHCARS_URL',
    default="http://cars_inventory_api:3050/")
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
        return None
    except Exception as err:
        current_function_name = inspect.currentframe().f_code.co_name
        logger.error(f"ERROR: Unexpected error in {current_function_name}")
        logger.error(f"ERROR: Unexpected {err=}, {type(err)=}")
        logger.error("ERROR: Network exception occurred")
        return None


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
        return {"sentiment": "Service Error"} 


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    logger.info(f"DEBUG: request_url = {request_url}")

    try:
        response = requests.post(request_url, json=data_dict)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        # Manage errors specific to the request
        logger.error(f"ERROR: Request exception in post_review: {e}")
        return {"status": response.status_code if 'response' in locals() else 503,
                 "message": f"Backend service error or network error: {e}"}

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
    logger.info(f"DEBUG: GET from {request_url}")

    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        # Manage the errors specific to the request (connection, timeout, HTTP error)
        logger.error(f"ERROR: Request exception in searchcars_request: {e}")

        # Restore the locals() chack for the status
        return {"status": response.status_code if 'response' in locals else 503,
                "message": f"Cars service error or network error: {e}"}

    except Exception as err:
        current_function_name = inspect.currentframe().f_code.co_name
        logger.error(f"ERROR: Unexpected error in {current_function_name}")
        logger.error(f"ERROR: Unexpected {err=}, {type(err)=}")
        logger.error("ERROR: Network exception occurred")
        return {"status": 500, "message": "Unexpected server error"}
