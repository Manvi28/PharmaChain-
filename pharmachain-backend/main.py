from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# 🔹 In-memory DB (for demo)
reviews_db = {}

@app.route("/")
def home():
    return "Backend running!"

# 🔥 ADD REVIEW (matches frontend: /submit-review)
@app.route("/submit-review", methods=["POST"])
def submit_review():
    data = request.json

    batch_id = data.get("batchId")
    review = data.get("review")
    user = data.get("user", "Anonymous")

    if not batch_id or not review:
        return jsonify({"error": "Missing fields"}), 400

    review_data = {
        "review": review,
        "user": user,
        "location": data.get("location", "Unknown"),
        "pharmacy": data.get("pharmacy", "Not provided"),
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    if batch_id not in reviews_db:
        reviews_db[batch_id] = []

    reviews_db[batch_id].append(review_data)

    return jsonify({"message": "Review submitted successfully"})


# 🔹 GET REVIEWS
@app.route("/get-reviews/<batch_id>", methods=["GET"])
def get_reviews(batch_id):
    return jsonify(reviews_db.get(batch_id, []))


# 🔥 FRAUD ALERT LOGIC (BATCH LEVEL)
@app.route("/alert/<batch_id>", methods=["GET"])
def check_alert(batch_id):
    reviews = reviews_db.get(batch_id, [])

    if not reviews:
        return jsonify({"alert": False})

    # 🔹 Rule 1: fake keyword detection
    fake_count = sum(
        1 for r in reviews
        if "fake" in r["review"].lower()
    )

    # 🔹 Rule 2: too many reviews in short time (simple anomaly)
    recent_reviews = len(reviews)

    # 🔹 Basic risk scoring
    risk_score = 0

    if fake_count >= 2:
        risk_score += 3

    if recent_reviews > 10:
        risk_score += 2

    if risk_score >= 3:
        return jsonify({
            "alert": True,
            "message": "⚠️ Suspicious batch detected"
        })

    return jsonify({"alert": False})


# 🔥 OPTIONAL: CLEAR DATA (for testing)
@app.route("/clear", methods=["POST"])
def clear_data():
    reviews_db.clear()
    return jsonify({"message": "All data cleared"})


if __name__ == "__main__":
    app.run(debug=True)