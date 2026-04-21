export default async function usersLoader() {
    const response = await fetch("https://natascha-quacker-api.onrender.com/users");

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();

    return data.users;
}