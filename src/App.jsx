import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import { getAllLanguages, getLanguage, baseUrl } from "./components/api";
import Map from "./components/MainMap";
import './App.css';

function App() {
  return (
    <>
    <div className="mapDivider">
      <Header />
      <SideBar />
      <SpecificLanguage id={1} />
    </div>
    </>

  );
}

function SpecificLanguage({id}) {
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
          {language.languageName} specific language {language.languageFamily}
          <Map yellowUrl={`${baseUrl}${language.yellowImg}`} />
        </div>
      );
}

function LanguageList() {
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    getAllLanguages()
      .then((data) => setLanguages(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <ul>
      {languages && languages.map((l) => (

        <li key={l.id}>
            {l.languageName} {l.languageFamily}
          <img src={`${baseUrl}${l.greenImg}`} width="100" />
          <img src={`${baseUrl}${l.yellowImg}`} width="100" />
        </li>
      ))}
    </ul>
  );
}

export default App
