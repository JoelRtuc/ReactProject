import './SideBarStyle.css';
import { getLanguage, baseUrl } from "./api";
import { useState, useEffect } from 'react';

export default function SideBar({id, guessed, setGuessed, setNextRound, setScore, points, roundCount, setRoundCount, roundOver}){
    const [language, setLanguage] = useState();
    const [error, setError] = useState();
    const [hint1, setHint1] = useState(false);
    const [hint2, setHint2] = useState(false);

      useEffect(()=> {getLanguage(id)
    .then((data) => setLanguage(data))
        .catch((err) => setError(err.message));
      }, [id]);

        if (error) return <p>{error}</p>;
        if (!language) return <p>Loading...</p>;

        return (
        <div className="sidebar">
            <p>{points}</p>
            <p>And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is invisible to the eye.</p>
            <p>{language.languageExample}</p>

            {hint1 ? (
            <p>{language.languageFamily}</p>
            ) : (
            <button onClick={() => { setHint1(true); setScore(points - 50); }} type="button">
                hint 1
            </button>
            )}

            {hint2 ? (
            <p>{language.languageName}</p>
            ) : (
            <button onClick={() => { setHint2(true); setScore(points - 50); }} type="button">
                hint 2
            </button>
            )}

            {roundOver ? null : (
            guessed ? (
                <>
                <p>{language.languageDescription}</p>
                <button onClick={() => { setNextRound(); setHint1(false); setHint2(false); }} type="button">
                    Next Round
                </button>
                </>
            ) : (
                <button type="button" onClick={() => { setGuessed(true); setRoundCount(roundCount + 1); }}>
                Guess
                </button>
            )
            )}
        </div>
        );


}