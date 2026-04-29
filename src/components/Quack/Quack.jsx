import "./Quack.sass";
// display all quacks on the home page feed, and also display the quacks on the user's profile page (the quacks that the user has created)


export default function Quack({ quack }) {

    return (
        <section className="quack">

            <article key={quack.id} className="quack">

                <div className="quack__author">
                    <img src={quack.author?.avatar} alt={quack.author?.username} />
                    {quack.author.username && (
                        <p>By: {quack.author.username}</p>
                    )}
                    {quack.author.name && (
                        <p>By: {quack.author.name}</p>
                    )}
                </div>
                
            
            </article>

        </section>
    )

}