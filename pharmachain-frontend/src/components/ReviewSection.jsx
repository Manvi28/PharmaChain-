import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewSection({ batchId, readOnly=false }) {

  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [user, setUser] = useState("");

  // 🔥 BASE URL (FIXED)
  const BASE_URL = "https://pharmachain-m05s.onrender.com";

  // 🔍 FETCH REVIEWS + ALERT
  async function fetchReviews() {
    try {
      const res = await axios.get(`${BASE_URL}/get-reviews/${batchId}`);
      setReviews(res.data);

      const alertRes = await axios.get(`${BASE_URL}/alert/${batchId}`);

      if (alertRes.data.alert) {
        setAlertMsg(alertRes.data.message);
      } else {
        setAlertMsg("");
      }

    } catch (err) {
      console.log("Fetch error:", err);
    }
  }

  useEffect(() => {
    if (batchId) fetchReviews();
  }, [batchId]);

  // 🔥 SUBMIT REVIEW
  async function handleSubmit() {

    if (!review || !pharmacy || !user) {
      alert("Fill all fields");
      return;
    }

    // 🔥 RANDOM LOCATION (FOR DEMO TESTING)
    const testLocations = ["Kolkata","Delhi","Mumbai","Chennai"];
    let location = testLocations[Math.floor(Math.random() * testLocations.length)];

    // 🔥 GPS (OPTIONAL - OVERRIDES RANDOM)
    if (navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
            resolve();
          },
          () => resolve()
        );
      });
    }

    const data = {
      batchId,
      review,
      user,
      location,
      pharmacy
    };

    try {
      await axios.post(`${BASE_URL}/submit-review`, data);

      // 🔄 RESET FORM
      setReview("");
      setPharmacy("");
      setUser("");

      // 🔄 REFRESH DATA
      fetchReviews();

    } catch (err) {
      console.log("Submit error:", err);
    }
  }

  return (
    <div style={{ marginTop: "15px" }}>

      <h4>Reviews</h4>

      {/* 🚨 ALERT MESSAGE */}
      {alertMsg && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          🚨 {alertMsg}
        </p>
      )}

      {/* ✍️ INPUT SECTION */}
      {!readOnly && (
        <>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Your Name"
          />

          <br /><br />

          <input
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Enter review"
          />

          <br /><br />

          <select value={pharmacy} onChange={(e) => setPharmacy(e.target.value)}>
            <option value="">Select Pharmacy</option>
            <option value="Apollo Pharmacy">Apollo Pharmacy</option>
            <option value="MedPlus">MedPlus</option>
            <option value="Local Chemist">Local Chemist</option>
          </select>

          <br /><br />

          <button onClick={handleSubmit}>Submit</button>
        </>
      )}

      {/* 📋 REVIEW LIST */}
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        <ul>
          {reviews.map((r, i) => (
            <li key={i}>
              <b>User:</b> {r.user} <br />
              <b>Location:</b> {r.location} <br />
              <b>Pharmacy:</b> {r.pharmacy} <br />
              <b>Time:</b> {r.time} <br />
              <b>Review:</b> {r.review}
              <hr />
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}