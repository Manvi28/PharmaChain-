import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewSection({ batchId, readOnly=false }) {

  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [user, setUser] = useState(""); // 🔥 NEW

  async function fetchReviews() {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get-reviews/${batchId}`);
      setReviews(res.data);

      const alertRes = await axios.get(`http://127.0.0.1:5000/alert/${batchId}`);

      if (alertRes.data.alert) {
        setAlertMsg(alertRes.data.message);
      } else {
        setAlertMsg("");
      }

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (batchId) fetchReviews();
  }, [batchId]);

  async function handleSubmit() {

    if (!review || !pharmacy || !user) {
      alert("Fill all fields");
      return;
    }

    let location = "Unknown";

    await new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
            resolve();
          },
          () => resolve()
        );
      } else {
        resolve();
      }
    });

    const data = {
      batchId,
      review,
      user, // 🔥 NOW FROM INPUT
      location,
      pharmacy
    };

    try {
      await axios.post("http://127.0.0.1:5000/submit-review", data);

      setReview("");
      setPharmacy("");
      setUser(""); // 🔥 CLEAR INPUT
      fetchReviews();

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={{ marginTop: "15px" }}>

      <h4>Reviews</h4>

      {alertMsg && (
        <p style={{ color: "red" }}>{alertMsg}</p>
      )}

      {/* 🔥 ONLY FOR USERS */}
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