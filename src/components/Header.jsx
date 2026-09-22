import './HeaderStyle.css'
import minordleSymbol from "./MinordleSymbol.png";
import { baseUrl } from './api';

function Header({user}) {
  return (
    <>
    <header className="header">
      {user ? (<> <img src={`${baseUrl}${user.profilePicturePath}`} width="50" alt="profile" />
      <div>{user.username}</div>  </>) : <></>}
      <img src={minordleSymbol} alt="MinordleSymbol" className='minordleSymbol' />
    </header>
    </>
  );
}

export default Header;
