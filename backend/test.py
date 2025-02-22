import requests

url = "https://newsapi.org/v2/everything?q=Apple&sortBy=popularity&apiKey=281e38068b43403e9b7869cfca993a41"

response = requests.get(url)
data = response.json()

# Filter articles where 'urlToImage' is not null
filtered_articles = [article for article in data['articles'] if article['urlToImage']]

for article in filtered_articles:
    print(article['title'], "-", article['url'])
