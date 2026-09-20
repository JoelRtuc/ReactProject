import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import { getAllLanguages, getLanguage, baseUrl } from "./components/api";
import Map from "./components/MainMap";
import './App.css';

function App() {
  const [guessed, setGuessed] = useState(false);
  const [points, setPoints] = useState(100);
  const [languages, setLanguages] = useState([]);
  const [randomId, setRandomId] = useState(null);
  const [error, setError] = useState(null);

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

  function NewRandom(){
    const random = Math.floor(Math.random() * languages.length + 1) + 1
    setRandomId(random);
  }

  function nextRound(){
    NewRandom();
    setGuessed(false);
  }

  if (error) return <p>{error}</p>;

  if (randomId == null) return <p>Loading...</p>;

  return (
    <div className="mapDivider">
      <Header />
      <SideBar id={randomId} guessed={guessed} setGuessed={setGuessed} setNextRound={nextRound} setScore={setPoints} points={points} />
      <MapLanguage id={randomId} bool={guessed} onTheScore={setPoints} />
    </div>
  );
}

function MapLanguage({id, bool, onTheScore}) {
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
           onScore={onTheScore} />
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
