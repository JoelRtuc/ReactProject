import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import { getAllLanguages, getLanguage, baseUrl } from "./components/api";
import Window from "./components/RulesWindow.jsx";
import Map from "./components/MainMap";
import './App.css';

function App() {
  const [guessed, setGuessed] = useState(false);
  const [points, setPoints] = useState(100);
  const [languages, setLanguages] = useState([]);
  const [randomId, setRandomId] = useState(null);
  const [error, setError] = useState(null);
  const [roundCount, roundCountSet] = useState(1);
  const [roundsOver, roundsOverSet] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getAllLanguages()
      .then((data) => setLanguages(data))
        .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (languages.length && randomId == null) {
      NewRandom();
    }
  }, [languages]);

  useEffect(() => {
  if (roundCount > 5) {
    roundsOverSet(true);
  }
}, [roundCount]);

  function NewRandom(){
    const random = Math.floor(Math.random() * languages.length + 1) + 1
    setRandomId(random);
  }

  function nextRound(){
    NewRandom();
    setGuessed(false);
  }

  function handleLogin(user) {
    setCurrentUser(user);
  }

  if (error) return <p>{error}</p>;

  if (randomId == null) return <p>Loading...</p>;

  return (
    <div className="mapDivider">
        <Window roundOver={roundsOver} onLogin={handleLogin} />
        <SideBar id={randomId} guessed={guessed} setGuessed={setGuessed} setNextRound={nextRound} setScore={setPoints} points={points} roundCount={roundCount} setRoundCount={roundCountSet} roundOver={roundsOver} />
        <MapLanguage id={randomId} bool={guessed} onTheScore={setPoints} scoreMap={points} roundOver={roundsOver} />
        <Header user={currentUser} />
    </div>
  );
}

function MapLanguage({id, bool, onTheScore, scoreMap}) {
  const [language, setLanguage] = useState();
    const [error, setError] = useState();


  useEffect(()=> {getLanguage(id)
    .then((data) => setLanguage(data))
        .catch((err) => setError(err.message));
      }, [id]);

        if (error) return <p>{error}</p>;
        if (!language) return <p>Loading...</p>;

      return (
        <div>
          <Map greenUrl={`${baseUrl}${language.greenImg}`}
           yellowUrl={`${baseUrl}${language.yellowImg}`}
           guessed={bool} 
           onScore={onTheScore} 
           score={scoreMap} />
        </div>
      );
}

function randomLanguage(){
    const [languages, setLanguages] = useState([]);
    const [error, setError] = useState();

      useEffect(() => {
      getAllLanguages()
      .then((data) => setLanguages(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;

  if(languages && languages.length){
    return (Math.floor(Math.random() * languages.length) + 1);
  }
  else{
    return 1;
  }

}

export default App
