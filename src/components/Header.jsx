import './HeaderStyle.css'
import minordleSymbol from "./MinordleSymbol.png";

function Header({user}) {
  return (
    <>
    <header className="header">
      <img src={minordleSymbol} alt="MinordleSymbol" className='minordleSymbol' />
    </header>
    </>
  );
}

export default Header;
