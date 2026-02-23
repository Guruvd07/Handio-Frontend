import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ReviewList({ providerId }: any) {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/reviews/${providerId}`)
       .then(r => setReviews(r.data));
  }, [providerId]);

  return (
    <div>
      <h3>Reviews</h3>

      {reviews.map(r => (
        <div key={r._id} style={{border:"1px solid #ccc", padding:10}}>
          <b>{r.customer.name}</b>
          <p>⭐ {r.rating}</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
