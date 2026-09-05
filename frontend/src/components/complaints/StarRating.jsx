import { useState } from "react";

const StarRating = ({ rating = 0, setRating, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`text-4xl cursor-pointer transition ${
            value <= (hover || rating)
              ? "text-yellow-400"
              : "text-gray-300"
          } ${readOnly ? "cursor-default" : ""}`}
          
          onClick={() => !readOnly && setRating && setRating(value)}
          onMouseEnter={() => !readOnly && setHover(value)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;