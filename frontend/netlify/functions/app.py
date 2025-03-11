from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_lambda import FlaskLambda  # Convert Flask to AWS Lambda
import newspaper
from textblob import TextBlob
import pickle
from nltk.sentiment import SentimentIntensityAnalyzer
import os

app = FlaskLambda(__name__)  # Convert Flask to Lambda
CORS(app)

sia = SentimentIntensityAnalyzer()

def analyze_sentiment(title_text_scores):
    total_score = sum(title_text_scores) / len(title_text_scores)
    if total_score > 0.5:
        total_sentiment = "Very Positive"
    elif total_score > 0.2:
        total_sentiment = "Slightly Positive"
    elif -0.2 < total_score < 0.2:
        total_sentiment = "Neutral"
    elif total_score < -0.2:
        total_sentiment = "Slightly Negative"
    else:
        total_sentiment = "Very Negative"
    return total_sentiment, total_score

def analyze_sentiment_vader(texts):
    scores = [sia.polarity_scores(text)['compound'] for text in texts]
    total_score = sum(scores) / len(scores)
    return analyze_sentiment([total_score])

BASE_DIR = os.path.dirname(__file__)

def classify_political_bias(text):
    with open((BASE_DIR, "political_bias_model.pkl"), 'rb') as model_file:
        political_model = pickle.load(model_file)
    with open((BASE_DIR, "political_bias_model.pkl"), 'rb') as vectorizer_file:
        tfidf_vectorizer = pickle.load(vectorizer_file)
    text_vectorized = tfidf_vectorizer.transform([text])
    return political_model.predict(text_vectorized)[0]

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the News Sentiment & Political Bias Analyzer!"})

@app.route("/api/analyze", methods=["GET"])
def analyze_article():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "Missing 'url' parameter"}), 400

    article = newspaper.Article(url, language='en')
    article.download()
    article.parse()
    article.nlp()

    article_data = {
        "title": article.title,
        "text": article.text,
        "authors": article.authors,
        "published_date": str(article.publish_date),
        "keywords": article.keywords,
        "summary": article.summary
    }

    title_score = TextBlob(article_data["title"]).sentiment.polarity
    text_score = TextBlob(article_data["text"]).sentiment.polarity
    total_sentiment, total_score = analyze_sentiment([title_score, text_score])
    vader_sentiment, vader_score = analyze_sentiment_vader([article_data["title"], article_data["text"]])
    political_bias = classify_political_bias(article_data["text"])

    return jsonify({
        "title": article_data["title"],
        "published_date": article_data["published_date"],
        "authors": article_data["authors"],
        "keywords": article_data["keywords"][:5],
        "title_sentiment": title_score,
        "text_sentiment": text_score,
        "total_sentiment": total_sentiment,
        "vader_text_sentiment": vader_sentiment,
        "vader_score": vader_score,
        "total_score": total_score,
        "political_bias": political_bias,
        "article_text_excerpt": article_data["text"][:500]
    })
