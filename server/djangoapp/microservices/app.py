from flask import Flask
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import json
import os # Import to handle the path of the 'sentiment' folder

try:
    # Tries to find the VADER package (it should be present if the Docker image is built correctly)
    # Note: In a containerized environment, it is better to ensure the lexicon is copied 
    # during Docker image build rather than downloading it at runtime.
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    # Handle the case where the resource is not found (which means it needs downloading or locating)
    print("Vader lexicon not found. Attempting to download...")
    
    # We download the lexicon inside the container if it's missing.
    try:
        nltk.download('vader_lexicon')
    except Exception as e:
        # Catch any errors during the actual download
        print(f"Error during NLTK download: {e}")
        # Re-raise the error if it is critical, or just continue if the lexicon is expected to be present
        # In this project, the file is usually copied, so this block is mainly for robust error handling.

# Standard Flask initialization
app = Flask(__name__)

# Initialize the Sentiment Analyzer after ensuring the lexicon is available
sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. Use /analyze/text to get the sentiment"


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):
    """
    Analyzes the sentiment of the input text and returns a result (positive, negative, neutral).
    """
    scores = sia.polarity_scores(input_txt)
    
    pos = float(scores['pos'])
    neg = float(scores['neg'])
    neu = float(scores['neu'])
    
    res = "neutral" # Default value
    
    # Determination of the dominant sentiment
    if neg > pos and neg > neu:
        res = "negative"
    elif pos > neg and pos > neu:
        res = "positive"
    
    # The case where neu is dominant is already covered by the default value
    
    result_json = json.dumps({"sentiment": res})
    
    # Display scores for debugging (will be visible in container logs)
    print(f"Scores for '{input_txt}': {scores} -> Result: {res}")
    
    return result_json


if __name__ == "__main__":
    # The application listens on all interfaces (0.0.0.0) and port 5000
    # Debugging is disabled for production
    app.run(debug=False, host='0.0.0.0', port=5000)
