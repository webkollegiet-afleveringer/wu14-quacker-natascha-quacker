export default async function userLoader({ params }) {
    const id = params.id;

    const response = await fetch(
        `https://natascha-quacker-api.onrender.com/users/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    const user = await response.json();

    return user;
}