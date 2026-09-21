import './RulesWindowStyle.css';
import { useState, useEffect } from 'react';
import { getAllUsers, registerUser } from './api';

export default function Window({ roundOver, onLogin }) {
  const [hide, hideSet] = useState(false);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [view, setView] = useState("login"); // "login" | "register" | "userList"

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  }, []);

  function handleLogin() {
    const match = users.find(
      (u) => u.username === username && u.password === password
    );

    if (match) {
      setError(null);
      onLogin(match);
      hideSet(true);
    } else {
      setError("Username or password incorrect");
    }
  }

  async function handleRegister() {
    if (!username || !password) {
      setError("Enter a username and password");
      return;
    }
    if (users.some((u) => u.username === username)) {
      setError("Username already taken");
      return;
    }

    try {
      const newUser = await registerUser({ username, password });
      setUsers((prev) => [...prev, newUser]);
      setError(null);
      onLogin(newUser);
      hideSet(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (hide && !roundOver) {
    return null;
  }

  if (roundOver) {
    return <div className="rules">round is over!</div>;
  }

  return (
    <div className="rules">
      {view === "userList" ? (
        <>
          <p>All users</p>
          <ul>
            {users.map((u) => (
              <li key={u.id}>{u.username}</li>
            ))}
          </ul>
          <button type="button" onClick={() => setView("login")}>
            Back
          </button>
        </>
      ) : (
        <>
          <p>rules:</p>
          <p>
            These are ONLY minority languages, languages such as Swedish and Hungarian
            are part of the list but you are supposed to guess where they are a minority
            not majority.
          </p>
          <p>There are five rounds and points are accumulated.</p>
          <p>
            Using a hint costs 50 points, guessing in the yellow you get 100 points,
            in the green 200 points.
          </p>

          <p>username</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <p>password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          {view === "register" ? (
            <>
              <button type="button" onClick={handleRegister}>Register</button>
              <button type="button" onClick={() => { setView("login"); setError(null); }}>
                Back to login
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={handleLogin}>Login</button>
              <button type="button" onClick={() => { setView("register"); setError(null); }}>
                Register instead
              </button>
            </>
          )}

          <button type="button" onClick={() => setView("userList")}>
            View all users
          </button>
        </>
      )}
    </div>
  );
}