from flask import Flask, jsonify, request
from flask_cors import CORS
import newspaper
from textblob import TextBlob
import pickle

app = Flask(__name__)
CORS(app)

# Load pretrained model and TF-IDF vectorizer
with open('political_bias_model.pkl', 'rb') as model_file:
    political_model = pickle.load(model_file)

with open('tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
    tfidf_vectorizer = pickle.load(vectorizer_file)

# Sentiment Analysis function
def analyze_sentiment(title_text_scores):
    total_score = sum(title_text_scores) / len(title_text_scores)
    if total_score > 0.1:
        total_sentiment = "Positive 😊"
    elif total_score < -0.1:
        total_sentiment = "Negative 😡"
    else:
        total_sentiment = "Neutral 😐"
    return total_sentiment, total_score

# Political Bias Classification function
def classify_political_bias(text):
    # Vectorize the text and predict political category (left, right, neutral)
    text_vectorized = tfidf_vectorizer.transform([text])
    prediction = political_model.predict(text_vectorized)

    return prediction[0]

# Route for home
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the News Sentiment & Political Bias Analyzer!"})

# Route for analyzing article sentiment and political bias
@app.route("/api/analyze", methods=["GET"])
def analyze_article():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "Missing 'url' parameter"}), 400
    
    # Fetch the article using Newspaper3k
    article = newspaper.Article(url, language='en')
    article.download()
    article.parse()

    # Extract article details
    article_data = {
        "title": article.title,
        "text": article.text,
        "authors": article.authors,
        "published_date": str(article.publish_date),
        "top_image": article.top_image,
        "videos": article.movies,
        "keywords": article.keywords,
        "summary": article.summary
    }

    # Get sentiment scores for title and text
    title_score = TextBlob(article_data["title"]).sentiment.polarity  # Score for title
    text_score = TextBlob(article_data["text"]).sentiment.polarity  # Score for full text

    # Calculate the total sentiment based on title and text sentiment scores
    total_sentiment, total_score = analyze_sentiment([title_score, text_score])

    # Classify political bias of article text
    political_bias = classify_political_bias(article_data["text"])

    # Add sentiment and political bias results to article data
    article_data["total_sentiment"] = total_sentiment
    article_data["total_score"] = total_score
    article_data["political_bias"] = political_bias

    # Return the sentiment and political bias data as JSON response
    return jsonify({
        "title": article_data["title"],
        "published_date": article_data["published_date"],
        "title_sentiment": title_score,
        "text_sentiment": text_score,
        "total_sentiment": total_sentiment,
        "total_score": total_score,
        "political_bias": political_bias,
        "article_text_excerpt": article_data["text"][:500]  # First 500 characters
    })

# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=8000)
