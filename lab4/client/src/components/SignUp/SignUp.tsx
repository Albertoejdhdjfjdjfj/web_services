import React from 'react';
import { ResponseMessage } from '../../assets/interfaces/responseInterfaces';
import { useNavigate } from 'react-router';
import { signUp } from '../../assets/functions/requestsFunctions';
import './SignUp.css';

const SignUp = () => {
  const [error, setError] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [birthdate, setBirthdate] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const navigate = useNavigate();

  async function sendData() {
    const res: Response = await signUp(username, birthdate, email, password);
    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      setError(message.message);
      return;
    }
    navigate('/');
  }

  return (
    <div className="sign_up_wrapper">
      <div className="sign_up">
        <span>
          <div onClick={() => navigate('/')}>
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
          <p>Your birthdate</p>
          <input type="text" onChange={(e) => setBirthdate(e.target.value)} />
        </div>
        <div>
          <p>Email</p>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <p>Password</p>
          <input type="text" onChange={(e) => setPassword(e.target.value)} />
          <div>{error}</div>
        </div>
        <p onClick={sendData}>SignUp</p>
      </div>
    </div>
  );
};

export default SignUp;
