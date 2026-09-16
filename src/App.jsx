import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { getAllLanguages, getLanguage, baseUrl } from "./components/api";

function App() {
  return (
    <>
      <Header />
      <Footer />
      <LanguageList />
      <SpecificLanguage id={1} />
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
          {language.languageName} {language.languageFamily}
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
