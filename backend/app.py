from flask import Flask, jsonify, request
from flask_cors import CORS
import newspaper
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

# Sentiment Analysis function
def analyze_sentiment(title_text_scores):
    # Calculate average score
    total_score = sum(title_text_scores) / len(title_text_scores)
    
    # Determine total sentiment
    if total_score > 0.1:
        total_sentiment = "Positive 😊"
    elif total_score < -0.1:
        total_sentiment = "Negative 😡"
    else:
        total_sentiment = "Neutral 😐"
        
    return total_sentiment, total_score

# Route for home
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the News Sentiment Analyzer!"})

# Route for analyzing article sentiment
@app.route("/api/analyze", methods=["GET"])
def analyze_article():
    # Get the URL from the query parameter
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

    # Add sentiment results to article data
    article_data["total_sentiment"] = total_sentiment
    article_data["total_score"] = total_score

    # Return the sentiment data as JSON response
    return jsonify({
        "title": article_data["title"],
        "published_date": article_data["published_date"],
        "title_sentiment": title_score,
        "text_sentiment": text_score,
        "total_sentiment": total_sentiment,
        "total_score": total_score,
        "article_text_excerpt": article_data["text"]  # First 500 characters
    })

# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=8000)
