import { useState } from "react";
import api from "../api/axios";

export default function ReviewForm({ bookingId, onDone }: any) {

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    await api.post("/reviews", {
      bookingId,
      rating,
      comment
    });

    alert("Review submitted");
    onDone();
  };

  return (
    <div>
      <h3>Leave Review</h3>

      <select onChange={e => setRating(+e.target.value)}>
        {[1,2,3,4,5].map(n => (
          <option key={n}>{n}</option>
        ))}
      </select>

      <textarea
        placeholder="Write comment"
        onChange={e => setComment(e.target.value)}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
