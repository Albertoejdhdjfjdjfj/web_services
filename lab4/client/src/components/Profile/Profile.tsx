import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import DefaultAvatar from '../../assets/images/DefaultAvatar.svg';
import './Profile.css';

const Profile = () => {
  const [data, setData] = useState(false);
  useEffect(() => {
    const info = Cookies.get('user_info');
    setData(JSON.parse(info));
  }, []);
  return (
    <div className="profile">
      <h2>Settings</h2>
      <img src={DefaultAvatar} />
      {data && (
        <div>
          <div>
            <p>Username</p>
            <div>{data.username}</div>
          </div>
          <div>
            <p>Birthdate</p>
            <div>{data.birthday}</div>
          </div>
          <div>
            <p>Email</p>
            <div>{data.email}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
