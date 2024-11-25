import React from 'react';
import FaceImage from '../../assets/images/FaceImage.svg';
import './FacePage.css';

const FacePage = () => {
  return (
    <div className="face_page">
      <div>
        <h2>BIld your library</h2>
        <span>Over 400.000 books from fiction to the business literature</span>
        <p>Let's start</p>
      </div>
      <img src={FaceImage} />
    </div>
  );
};

export default FacePage;
