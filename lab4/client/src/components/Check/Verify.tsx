import React, { FC } from 'react';
import Cookies from 'js-cookie';
import { verifyCode } from '../../assets/functions/requestsFunctions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { TokensData, ResponseMessage } from '../../assets/interfaces/responseInterfaces';
import { CombineState } from '../../assets/interfaces/reduxInterfaces';

const Verify: FC = () => {
  const email = useSelector((state:CombineState)=>state.state_components.email)
  const [error, setError] = React.useState<string>('');
  const [code, setCode] = React.useState<string>('');
  const navigate = useNavigate();

  async function sendData(): Promise<void> {
    const res: Response = await verifyCode(email,code);

    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      setError(message.message);
      return;
    }

    const result: TokensData = await res.json();
    const { refreshToken, accessToken } = result;
    console.log(result)
    Cookies.set('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken);
    navigate('/');
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
        <h2>Verify code</h2>
        <div>
          <p>Code</p>
          <input type="text" onChange={(e) => setCode(e.target.value)} />
        </div>
        <p onClick={sendData}>Verify</p>
      </div>
    </div>
  );
};

export default Verify;
