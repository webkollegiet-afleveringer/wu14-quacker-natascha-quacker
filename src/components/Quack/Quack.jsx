import "./Quack.sass";
import { BiMessageRounded } from "react-icons/bi";
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineArrowUpTray } from "react-icons/hi2";
import { Link } from "react-router";


export default function Quack({ quack }) {

    return (
        <section className="quack">

            {/* MARK: Author Image */}
            {/* link to author users profile */}
            <Link to={`/users/${quack.author?.id}`} className="quack__author-link">
                <img src={quack.author?.avatar} alt={quack.author?.username} className="quack__author-image" />
            </Link>


            <article className="quack__article">
                
                {/* MARK: Author Info */}
                <div className="quack__author">
                    {/* link to author users profile */}
                    <Link to={`/users/${quack.author?.id}`} className="quack__author-name">
                        {quack.author.name && (
                            <p>{quack.author.name}</p>
                        )}
                    </Link>
                    {quack.author.username && (
                        <p className="quack__author-username">@{quack.author.username}</p>
                    )}
                </div>

                {/* MARK: Content | Tags */}
                {/* if content exists */}
                {quack.content && (
                    <p className="quack__content">
                        {/* Split content op i "dele": hashtags, mellemrum og almindelig tekst */}
                        {/* split content into "parts": hashtags, spaces and regular text */}
                        {quack.content
                            // .match(/#\w+|\s+|[^\s#]+/g) is a regex that matches hashtags, spaces and regular text. It will split the content into an array of these parts.
                            .match(/#\w+|\s+|[^\s#]+/g)
                            // map over each parts
                            .map((part, index) => {
                                // check if the part is a hashtag (example: "#react")
                                // if the part starts with a "#" and is followed by one or more word characters, then it's a hashtag. The regex /^#\w+$/ checks for this pattern.
                                if (part.match(/^#\w+$/)) {
                                    // remove the "#" from the beginning of the hashtag to get the tag name (example: "react" from "#react"
                                    // The slice(1) method removes the first character of the string, which is the "#" symbol.
                                    const tag = part.slice(1);

                                    return (
                                        // use the tag variable ("react") to create a link to the tag page (example: "/tags/react" for the "#react" hashtag)
                                        <Link
                                            key={index}
                                            to={`/tags/${tag}`}
                                            className="quack__tag"
                                        >
                                            {/* use the part text to display the hashtag */}
                                            {part}
                                        </Link>
                                    );
                                }

                                // if the part is not a hashtag, return it as a span with the original text (this will include spaces and regular text)
                                return <span key={index}>{part}</span>;
                            })
                            // this way the content of the quack will be displayed with the hashtags as clickable links, while the regular text and spaces will be displayed as normal text, while keeping the original formatting of the content intact.
                        }
                    </p>
                )}


                {/* MARK: Media */}
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


                {/* MARK: Interactions */}
                <div className="quack__interactions">
                    {/* comments, reposts and like buttons will go here */}
                    {/* clicking the comments count will open a div under the quack that shows all the comments */}
                    {/* inside the div but above the comments, there will be a form for adding a comment to this quack */}
                    {/* adding a comment will increase the comment count and also add the quack to the users quacksRepliedTo array */}
                    {/* MARK: Comments */}
                    <button className="quack__interaction-button">
                        <BiMessageRounded className="icon" />
                        {quack.comments && quack.comments.length > 0 ? quack.comments.length : 0}
                    </button>
                    
                    {/* clicking the reposts count button will take the user to a page that shows all reposts of this quack */}
                    {/* MARK: Reposts */}
                    <Link to={`/quacks/reposts/${quack.id}`} className="quack__interaction-button">
                        <HiOutlineArrowPathRoundedSquare className="icon" />
                        {quack.reposts && quack.reposts.length > 0 ? quack.reposts.length : 0}
                    </Link>
                    
                    {/* liking a quack will increase the like count and add the quack to the users quacksLiked array */}
                    {/* MARK: Likes */}
                    <button className="quack__interaction-button">
                        <IoMdHeartEmpty className="icon" />
                        {quack.likes && quack.likes.length > 0 ? quack.likes.length : 0}
                    </button>
                    
                    {/* maybe link to the create quack page and check if user got here from the repost button. If so, pre-fill the repost form with the original quack */}
                    {/* can i maybe send the original quack data inside the Link somehow? */}
                    {/* I think i did in another project */}
                    {/* MARK: Repost Quack */}
                    <Link to={`/quacks/${quack.id}/repost`} className="quack__interaction-button">
                        <HiOutlineArrowUpTray className="icon" />
                    </Link>
                
                </div>

            </article>
            
        </section>
    )

}