# Source: https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html#sphx-glr-auto-examples-classification-plot-classifier-comparison-py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

# import classifiers
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.tree import DecisionTreeClassifier

df = pd.read_csv("1/Political_Bias.csv")
df = df.dropna(subset=['Text', 'Bias'])

# convert text to numerical features
# ngram_range -> unigrams and bigrams
# max_df -> removes words in 98% of articles

tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_df=0.98, stop_words='english')
X = tfidf_vectorizer.fit_transform(df['Text'])
y = df['Bias']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# List of classifiers
classifiers = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "SVM (Linear)": SVC(kernel="linear"),
    "SVM (RBF)": SVC(kernel="rbf"),
    "Random Forest": RandomForestClassifier(n_estimators=100),
    "Decision Tree": DecisionTreeClassifier(),
    "Naive Bayes": MultinomialNB(),
    "Neural Network": MLPClassifier(max_iter=1000),
    "AdaBoost": AdaBoostClassifier()
}

# Train and evaluate classifiers
accuracy_results = {}

for name, clf in classifiers.items():
    model = make_pipeline(StandardScaler(with_mean=False), clf)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    accuracy_results[name] = accuracy
    print(f"{name}: Accuracy = {accuracy:.4f}")

# Plot results
plt.figure(figsize=(10, 5))
plt.barh(list(accuracy_results.keys()), list(accuracy_results.values()), color='skyblue')
plt.xlabel("Accuracy")
plt.ylabel("Classifier")
plt.title("Classifier Performance Comparison")
plt.show()
