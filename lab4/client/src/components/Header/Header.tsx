import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { set_search } from '../../redux/actions/state_components/actions';
import Logo from '../../assets/images/Logo.svg';
import Glass from '../../assets/images/Glass.svg';
import DefaultAvatar from '../../assets/images/DefaultAvatar.svg';
import { ResponseMessage, TokensData } from '../../assets/interfaces/responseInterfaces';
import { verifyToken ,updateTokens} from '../../assets/functions/requestsFunctions';
import './Header.css';
import ProfileMenu from './ProfileMenu/ProfileMenu';

const Header = () => {
  const [tokenIsAccurate, setStateToken] = useState<boolean>(false);
  const [stateMenu,setStateMenu]=useState(false);
  const dispatch = useDispatch();
  const path = useLocation();
  const navigate = useNavigate();

  const checkToken = async () => {
    const res: Response = await verifyToken();
    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      console.log(message)
      const newRes:Response = await updateTokens()
      if(newRes.status >=400){
        const message: ResponseMessage = await newRes.json();
        console.log(message)
        setStateToken(false);
      }
      const result: TokensData = await newRes.json();
      console.log(result)
      const {refreshToken,accessToken} = result;
      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);
      return;
    }
    setStateToken(true);
  };

  function isCurrentPath(possible_path: string): boolean {
    if (possible_path == path.pathname) {
      return true;
    }
  
    return false;
  }
  
  
  function handleInput(e: React.ChangeEvent<HTMLInputElement>): void {
    if(path.pathname!='/'){
      navigate('/')
    }
    dispatch(set_search(e.target.value))
  }

  useEffect(() => {
    checkToken();
  }, [path]);

  return (
    <header>
      <img src={Logo} />
      <div>
        <img src={Glass} />
        <input
          onChange={handleInput}
          type="text"
          placeholder="Search by author, title, name"
        />
      </div>
      {
        !tokenIsAccurate&&<div>
          <a className={isCurrentPath('/log_in')?'current_page':''} onClick={()=>navigate('/log_in')}>Log in</a>
          <a className={isCurrentPath('/sign_up')?'current_page':''} onClick={()=>navigate('/sign_up')}>Sign up</a>
        </div>
}
{
        tokenIsAccurate&&<div>
          <a className={isCurrentPath('/')?'current_page':''}onClick={()=>navigate('/')}>All books</a>
          <a className={isCurrentPath('/orders')?'current_page':''}onClick={()=>navigate('/orders')}>Your orders</a>
          <img onClick={()=>setStateMenu(!stateMenu)}src={DefaultAvatar}/>
          { stateMenu&&<ProfileMenu/>}
        </div>
}
      
    </header>
  );
};

export default Header;
