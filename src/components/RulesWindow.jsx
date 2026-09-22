import { useState, useEffect } from 'react';
import { getAllUsers, registerUser, uploadProfilePicture, updateUser } from './api';
import './RulesWindowStyle.css';

export default function Window({ roundOver, onLogin, user, points, onUserUpdate }) {
  const [hide, hideSet] = useState(false);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [view, setView] = useState("login"); // "login" | "register" | "userList"
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
  if (roundOver && user) {
    const updatedResults = [...user.gameResults, points];
    const newHighScore = points > user.highScore ? points : user.highScore;

    const updatedUser = {
      ...user,
      gameResults: updatedResults,
      highScore: newHighScore,
    };

    onUserUpdate(updatedUser);

    updateUser(user.id, updatedUser).catch((err) =>
      console.error("Failed to save round result:", err)
    );
  }
}, [roundOver]);

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
  return (
    <div className="rules">
      <p>round is over!</p>
      <p>Score: {points}</p>
      {user && <p>High score: {Math.max(points, user.highScore)}</p>}
    </div>
  );
}

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPendingFile(file);
    } else {
      setError("Please drop an image file.");
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

      if (pendingFile) {
        await uploadProfilePicture(newUser.id, pendingFile);
      }

      setUsers((prev) => [...prev, newUser]);
      setError(null);
      onLogin(newUser);
      hideSet(true);
    } catch (err) {
      setError(err.message);
    }
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
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragging ? "3px dashed green" : "2px dashed gray",
                    padding: "20px",
                    textAlign: "center",
                    margin: "10px 0",
                  }}
                >
                  {pendingFile ? (
                    <p>Selected: {pendingFile.name}</p>
                  ) : (
                    <p>Drag and drop a profile picture here</p>
                  )}
                </div>
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