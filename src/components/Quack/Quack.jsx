import "./Quack.sass";
import { BiMessageRounded } from "react-icons/bi";
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineArrowUpTray } from "react-icons/hi2";
// display all quacks on the home page feed, and also display the quacks on the user's profile page (the quacks that the user has created)


export default function Quack({ quack }) {

    return (
        <section className="quack">

            <article key={quack.id} className="quack__article">
                    
                <img src={quack.author?.avatar} alt={quack.author?.username} className="quack__author-image" />
                
                <section className="quack__quack">
                    
                    <div className="quack__author">
                        {quack.author.name && (
                            <p className="quack__author-name">{quack.author.name}</p>
                        )}
                        
                        {quack.author.username && (
                            <p className="quack__author-username">@{quack.author.username}</p>
                        )}
                    </div>

                    {/* if content or media exists */}
                    {quack.content && (
                        // show text div
                        <div className="quack__text">

                            <p>{quack.content}</p>

                            {/* if tags exists - show tags div */}
                            {quack.tags && quack.tags.length > 0 ? (
                                // show tags div
                                <div className="quack__tags">
                                    {/* and map through them */}
                                    {quack.tags.map((tag) => (
                                        // for each tag, create a link to the tag page with the tag name as the link text, so that when a user clicks on a tag, they can see all quacks with that tag
                                        // (not implemented yet, but this is how we would set up the link to the tag page for each tag associated with the quack)
                                        <a href={`/tags/${tag}`} key={tag} className="quack__tag">
                                            #{tag}
                                        </a>
                                    ))}
                                </div>
                            ) : null}

                        </div>
                    )}

                    

                    {/* if media exist show media div */}
                    {quack.media && <div className="quack__media">
                        {/* if media type is image */}
                        {quack.media.type === "image" && (
                            // show img tag
                            <img src={quack.media.url} alt={quack.media.alt} key={quack.media.url} className="quack__media" />
                        )}
                        {/* if media type is video */}
                        {quack.media.type === "video" && (
                            // show video tag
                            <video src={quack.media.url} controls key={quack.media.url} className="quack__media" />
                        )}
                    </div>}

                    <div className="quack__interactions">
                        {/* comments, reposts and like buttons will go here */}
                        {/* clicking the comments count will open a div under the quack that shows all the comments */}
                        {/* inside the div but above the comments, there will be a form for adding a comment to this quack */}
                        {/* adding a comment will increase the comment count and also add the quack to the users quacksRepliedTo array */}
                        
                        <button className="quack__interaction-button">
                            <BiMessageRounded className="icon" />
                            {quack.comments && quack.comments.length > 0 ? quack.comments.length : 0}
                        </button>
                        
                        {/* clicking the reposts count button will take the user to a page that shows all reposts of this quack */}
                        
                        <button className="quack__interaction-button">
                            <HiOutlineArrowPathRoundedSquare className="icon" />
                            {quack.reposts && quack.reposts.length > 0 ? quack.reposts.length : 0}
                        </button>
                        
                        {/* liking a quack will increase the like count and add the quack to the users quacksLiked array */}
                        
                        <button className="quack__interaction-button">
                            <IoMdHeartEmpty className="icon" />
                            {quack.likes && quack.likes.length > 0 ? quack.likes.length : 0}
                        </button>
                        
                        {/* maybe link to the create quack page and check if user got here from the repost button. If so, pre-fill the repost form with the original quack */}
                        
                        <a href={`/quacks/${quack.id}/repost`} className="quack__interaction-button">
                            <HiOutlineArrowUpTray className="icon" />
                        </a>
                    
                    </div>

                </section>
            
            </article>

        </section>
    )

}