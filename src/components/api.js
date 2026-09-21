export const baseUrl = "https://localhost:7170";//HERE IS PORT

export const apiUrl = baseUrl + "/api/LanguageBases";
export const userUrl = baseUrl + "/api/Users";

export async function getAllLanguages(){
    const data = await fetch(apiUrl).then((data) => data.json());
    return data;
}

export async function getLanguage(id){
    const lan = await fetch(`${apiUrl}/${id}`)
    return lan.json();
}

export async function getUser(id){
    const lan = await fetch(`${userUrl}/${id}`)
    return lan.json();
}

export async function getAllUsers() {
  const res = await fetch(`${userUrl}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function registerUser(user) {
  const params = new URLSearchParams({
    username: user.username,
    password: user.password,
  });

  const res = await fetch(`${userUrl}?${params.toString()}`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to register user");
  return res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${baseUrl}/api/Users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to update user");
}