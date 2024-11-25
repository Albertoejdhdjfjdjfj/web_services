import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import './ProfileMenu.css'

const ProfileMenu = () => {
     const [data, setData] = useState(false);
     const navigate = useNavigate()
     useEffect(() => {
          const info = Cookies.get('user_info');
          setData(JSON.parse(info));
        }, []);

        const logOut=():void=>{
          Cookies.remove('token');
          navigate('/')
        }
     return (
          <div className='profile_menu'>
               <p>{data.username}</p>
               <div onClick={()=>navigate('/profile')}>Settings</div>
               <div onClick={()=>navigate('/orders')}>My orders</div>
               <div onClick={()=>logOut()}>Log out</div>
          </div>
     );
}

export default ProfileMenu;
