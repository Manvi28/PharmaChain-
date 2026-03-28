from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# 🔹 In-memory DB (for demo)
reviews_db = {}

# ✅ HEALTH CHECK ROUTE (IMPORTANT FOR RENDER)
@app.route("/")
def home():
    return "Backend running!"


# 🔥 ADD REVIEW (MANUAL USER INPUT)
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


# 🔥 SCAN API (AUTO TRACK LOCATION)
@app.route("/scan", methods=["POST"])
def scan_product():
    data = request.json

    batch_id = data.get("batchId")
    location = data.get("location", "Unknown")

    if not batch_id:
        return jsonify({"error": "Missing batchId"}), 400

    if batch_id not in reviews_db:
        reviews_db[batch_id] = []

    # 🔥 PREVENT SAME LOCATION SPAM
    existing_locations = [r.get("location") for r in reviews_db[batch_id]]
    if location in existing_locations:
        return jsonify({"message": "Already scanned at this location"})

    scan_data = {
        "review": "scan",
        "user": "scanner",
        "location": location,
        "pharmacy": "scan-system",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    reviews_db[batch_id].append(scan_data)

    return jsonify({"message": "Scan recorded"})


# 🔹 GET REVIEWS
@app.route("/get-reviews/<batch_id>", methods=["GET"])
def get_reviews(batch_id):
    return jsonify(reviews_db.get(batch_id, []))


# 🔥 FRAUD ALERT SYSTEM
@app.route("/alert/<batch_id>", methods=["GET"])
def check_alert(batch_id):
    reviews = reviews_db.get(batch_id, [])

    if not reviews:
        return jsonify({"alert": False})

    # 🔹 Extract locations
    locations = [r.get("location", "Unknown") for r in reviews]
    unique_locations = list(set(locations))

    # 🔹 Count fake reviews
    fake_count = sum(
        1 for r in reviews
        if "fake" in r["review"].lower()
    )

    # 🔥 MAIN FRAUD DETECTION (MULTI-LOCATION)
    if len(unique_locations) > 1:
        return jsonify({
            "alert": True,
            "message": "🚨 Same batch found in multiple locations",
            "details": {
                "locations": unique_locations,
                "total_scans": len(reviews),
                "fake_reviews": fake_count
            }
        })

    # 🔹 Suspicious based on fake keyword
    if fake_count >= 2:
        return jsonify({
            "alert": True,
            "message": "⚠️ Multiple users reported this product as fake",
            "details": {
                "locations": unique_locations,
                "fake_reviews": fake_count
            }
        })

    return jsonify({
        "alert": False,
        "details": {
            "locations": unique_locations,
            "total_scans": len(reviews)
        }
    })


# 🔥 CLEAR DATA (TESTING)
@app.route("/clear", methods=["POST"])
def clear_data():
    reviews_db.clear()
    return jsonify({"message": "All data cleared"})


# ✅ IMPORTANT: RENDER DEPLOY FIX
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)