export default async function quacksLoader() {
    const response = await fetch("https://natascha-quacker-api.onrender.com/quacks");

    if (!response.ok) {
        throw new Error("Failed to fetch quacks");
    }

    const data = await response.json();

    return data.quacks;
}