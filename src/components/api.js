export const baseUrl = "https://localhost:7170";

export const apiUrl = baseUrl + "/api/LanguageBases";

export async function getAllLanguages(){
    const data = await fetch(apiUrl).then((data) => data.json());
    return data;
}

export async function getLanguage(id){
    const lan = await fetch(`${apiUrl}/${id}`)
    return lan.json();
}