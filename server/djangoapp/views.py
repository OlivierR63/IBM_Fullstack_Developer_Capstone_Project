# Uncomment the required imports before adding the code

from django.contrib.auth.models import User
from django.contrib.auth import logout

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate
from .models import CarMake, CarModel
from .restapis import (
                    get_request, post_review,
                    analyze_review_sentiments,
                    searchcars_request
                    )


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)


# Create a `logout_request` view to handle sign out request
def logout_request(request):
    logout(request)
    data = {"username": ""}
    return JsonResponse(data)


# Create a `registration` view to handle sign up request
def registration(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    try:
        # Check if user already exists
        User.objects.get(username=username)
        username_exist = True
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        # If not, simply log this is a new user
        logger.debug(f"{username} is new user")

    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(
                                            username=username,
                                            first_name=first_name,
                                            last_name=last_name,
                                            password=password,
                                            email=email
                                        )
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)


# Update the `get_dealerships` render list of dealerships all by default,
# particular state if state is passed
def get_dealerships(request, state="All"):
    if (state == "All"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state

    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


# Create a `get_dealer_reviews` view to render the reviews of a dealer
def get_dealer_reviews(request, dealer_id):
    if (dealer_id):
        endpoint = '/fetchReviews/dealer/' + str(dealer_id)
        reviews = get_request(endpoint)

        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            review_detail['sentiment'] = response['sentiment']

        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# Create a `get_dealer_details` view to render the dealer details
def get_dealer_details(request, dealer_id):
    if (dealer_id):
        endpoint = '/fetchDealer/' + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# Create a `add_review` view to submit a review
@csrf_exempt
def add_review(request):
    # Authentication check to ensure only logged-in users can post reviews.
    if (not request.user.is_authenticated ):
        return JsonResponse(
                                {
                                    "status": 403,
                                    "message": "Unauthorized"
                                },
                                status=403
                            )

    data = json.loads(request.body)

    # Ensure the username is passed, overriding any name provided by the frontend
    # to guarantee consistency with the authenticated user.
    try:
        full_name = f"{request.user.first_name} {request.user.last_name}".strip()
        if not full_name:
            full_name = request.user.username
        data['name'] = full_name

        # Log the final payload being sent to the external API
        logger.info(f"DEBUG: Review payload for post_review = {data}")

        # Post the review using the external REST API function
        # The external post_review function should handle the data format required by the service.
        post_review(data)

        return JsonResponse({"status": 200, "message": "Review submitted successfully"})

    except json.JSONDecodeError:
        logger.error("ERROR: Failed to decode JSON from request body.")
        return JsonResponse(
                               {
                                   "status": 400,
                                   "message": "Invalid JSON format in request body"
                                },
                                status=400
                            )

    except Exception as err:
        logger.error(f"ERROR: Unexpected {err=}, {type(err)=} during review posting.")
        return JsonResponse(
                               {
                                   "status": 500,
                                   "message": "Error in posting review to external service"
                                },
                                status=500
                            )


# Create a 'get_cars' view, in order to get the list of cars
def get_cars(request):
    count = CarMake.objects.filter().count()

    if (count == 0):
        initiate()

    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        logger.debug(f"Modele: {car_model.name} et Marque: {car_model.car_make.name}")
        cars.append(
                        {
                            "CarModel": car_model.name,
                            "CarMake": car_model.car_make.name
                        }
                    )

    return JsonResponse({"CarModels": cars})


def get_inventory(request, dealer_id):
    data = request.GET

    if (dealer_id):
        if 'year' in data:
            endpoint = "/carsbyyear/"+str(dealer_id)+"/"+data['year']
        elif 'make' in data:
            endpoint = "/carsbymake/"+str(dealer_id)+"/"+data['make']
        elif 'model' in data:
            endpoint = "/carsbymodel/"+str(dealer_id)+"/"+data['model']
        elif 'mileage' in data:
            endpoint = "/carsbymaxmileage/"+str(dealer_id)+"/"+data['mileage']
        elif 'price' in data:
            endpoint = "/carsbyprice/"+str(dealer_id)+"/"+data['price']
        else:
            endpoint = "/cars/"+str(dealer_id)

        cars = searchcars_request(endpoint)
        return JsonResponse({"status": 200, "cars": cars})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})
    return JsonResponse({"status": 400, "message": "Bad Request"})
