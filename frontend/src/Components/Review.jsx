import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getComments, reviews } from "../../api";
import '../stylesheets/Review.css'

function Review() {
  const { id } = useParams(); // roomId
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [allcomments, setAllComment] = useState([]);

  // ✅ fetch all comments of this room
  const fetchAllcomments = async () => {
    try {
      const res = await getComments(id);
      setAllComment(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllcomments();
  }, []);

  const handleReview = async (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      return toast.warning("Rating and comment are required");
    }

    try {
      const res = await reviews(id, {
        rating: Number(rating),
        comment,
      });

      if (res.data.success) {
        toast.success("Thank you for your review ❤️");
        setSubmitted(true);

        fetchAllcomments(); // ✅ new comment instantly show

        setTimeout(() => {
          navigate(`/room/${id}`);
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="review-container">
      <h2>Review Your Stay</h2>

      <form onSubmit={handleReview}>
        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1–5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <button type="submit">Submit Review</button>
      </form>

      <hr />

      <h3>Customer Reviews</h3>

      {allcomments.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        allcomments.map((item) => (
          <div key={item._id} className="review-card">
            <p><strong>{item.user?.name || "User"}</strong></p>
            <p>{item.comment}</p>
            <p>⭐ {item.rating}/5</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Review;
