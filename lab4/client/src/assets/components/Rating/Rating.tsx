import React from 'react';
import BlackStar from '../../../assets/images/BlackStar.svg';
import Star from '../../../assets/images/Star.svg';
import './Rating.css';

const Rating = ({ book }) => {
  return (
    <div className="rating">
      {Array(book.rating.points > 0 ? Math.round(book.rating.points / book.rating.numRatings) : 0)
        .fill()
        .map((_, index) => (
          <img key={index} src={BlackStar} alt="star" />
        ))}

      {Array(
        book.rating.points > 0 ? 5 - Math.round(book.rating.points / book.rating.numRatings) : 5
      )
        .fill()
        .map((_, index) => (
          <img key={index} src={Star} alt="star" />
        ))}
    </div>
  );
};

export default Rating;
