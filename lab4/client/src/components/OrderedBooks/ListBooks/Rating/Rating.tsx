import React from 'react';
import BlackStar from '../../../assets/images/BlackStar.svg';
import Star from '../../../assets/images/Star.svg';
import './Rating.css';

const Rating = ({ rating }) => {
  return (
    <div className="rating">
      {Array(rating)
        .fill()
        .map((_, index) => (
          <img key={index} src={BlackStar} alt="star" />
        ))}

      {Array(5-rating)
        .fill()
        .map((_, index) => (
          <img key={index} src={Star} alt="star" />
        ))}
    </div>
  );
};

export default Rating;
