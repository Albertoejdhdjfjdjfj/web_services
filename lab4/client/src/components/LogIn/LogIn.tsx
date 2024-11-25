import React, { FC } from 'react';
import Cookies from 'js-cookie';
import { logIn } from '../../assets/functions/requestsFunctions';
import { useNavigate } from 'react-router';
import { UserData, ResponseMessage } from '../../assets/interfaces/responseInterfaces';
import './LogIn.css';

const LogIn: FC = () => {
  const [error, setError] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const navigate=useNavigate();

  async function sendData(): Promise<void> {
    const res: Response = await logIn(username, password);

    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      setError(message.message);
      return;
    }
    const result: UserData = await res.json();
    const { token, ...user_info } = result;
    Cookies.set('user_info', JSON.stringify(user_info));
    Cookies.set('token', token);
    navigate('/')
  }

  return (
    <div className="log_in_wrapper">
      <div className="log_in">
        <span>
          <div onClick={()=>navigate('/')}>
            <span></span>
            <span></span>
          </div>
        </span>
        <h2>Welcome to Fox Library</h2>
        <div>
          <p>Username</p>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <p>Password</p>
          <input type="text" onChange={(e) => setPassword(e.target.value)} />
          <div>{error}</div>
        </div>
        <p onClick={sendData}>SignIn</p>
      </div>
    </div>
  );
};

export default LogIn;