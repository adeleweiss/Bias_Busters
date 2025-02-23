from flask import Flask, jsonify, request
from flask_cors import CORS
import newspaper
from textblob import TextBlob
import pickle
from nltk.sentiment import SentimentIntensityAnalyzer
from flask_cors import cross_origin

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# TextBlob Sentiment Analysis function
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

sia = SentimentIntensityAnalyzer()

# Vader Sentiment Analysis function
def analyze_sentiment_vader(texts):
    scores = [sia.polarity_scores(text)['compound'] for text in texts]
    total_score = sum(scores) / len(scores)

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


# Political Bias Classification function
def classify_political_bias(text):

    # Load pretrained model and TF-IDF vectorizer
    with open('political_bias_model.pkl', 'rb') as model_file:
        political_model = pickle.load(model_file)

    with open('tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
        tfidf_vectorizer = pickle.load(vectorizer_file)

    # Vectorize the text and then predict political category based off text
    text_vectorized = tfidf_vectorizer.transform([text])
    prediction = political_model.predict(text_vectorized)

    return prediction[0]

# Route for app.py home
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the News Sentiment & Political Bias Analyzer!"})

# Route for extracting article data and analyzing sentiment and political bias
@app.route("/api/analyze", methods=["GET"])
def analyze_article():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "Missing 'url' parameter"}), 400
    
    # Fetch the article using Newspaper3k
    article = newspaper.Article(url, language='en')
    article.download()
    article.parse()
    article.nlp()

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
    title_score = TextBlob(article_data["title"]).sentiment.polarity 
    text_score = TextBlob(article_data["text"]).sentiment.polarity 

    # Calculate the total sentiment based on average of title and text sentiment scores
    total_sentiment, total_score = analyze_sentiment([title_score, text_score])

    vader_sentiment, vader_score = analyze_sentiment_vader([article_data["title"], article_data["text"]])

    # Classify political bias of article text
    political_bias = classify_political_bias(article_data["text"])

    # Add sentiment and political bias results to article data
    article_data["total_sentiment"] = total_sentiment
    article_data["total_score"] = total_score
    article_data["political_bias"] = political_bias

    # Return article data as JSON response 
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

# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=8000)
