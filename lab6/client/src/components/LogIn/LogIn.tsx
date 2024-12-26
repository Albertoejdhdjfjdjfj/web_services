import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { set_email } from '../../redux/actions/state_components/actions';
import { logIn } from '../../assets/functions/requestsFunctions';
import { useNavigate } from 'react-router';
import { TokensData, ResponseMessage } from '../../assets/interfaces/responseInterfaces';
import './LogIn.css';

const LogIn: FC = () => {
  const [error, setError] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('bairamukov.albert2003@gmail.com');
  const [password, setPassword] = React.useState<string>('albert26102003');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function sendData(): Promise<void> {
    const res: Response = await logIn(email, password);

    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      setError(message.message);
      return;
    }

    dispatch(set_email(email))
    navigate('/log_in/verify');
  }

  return (
    <div className="log_in_wrapper">
      <div className="log_in">
        <span>
          <div onClick={() => navigate('/')}>
            <span></span>
            <span></span>
          </div>
        </span>
        <h2>Welcome to Fox Library</h2>
        <div>
          <p>Email</p>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
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
