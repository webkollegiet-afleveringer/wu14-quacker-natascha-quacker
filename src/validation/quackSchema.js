import { z } from "zod";
import { contentField, mediaField } from "./formFields.js";


export const quackSchema = z.object({
    content: contentField,
    media: mediaField,
})
// refine is used to validate that at least one of the fields (content or media) is provided when creating a quack, since a quack can be either text-based (content) or media-based (media), but not both empty
.refine((data) => {
    // access the media field value from the context to check if both content and media are empty
    const media = data.media;
    // if both content and media are empty, return false to indicate validation failure, otherwise return true
    if (!data.content && !media) {
        return false;
    }
    return true;
}, "Please provide either content or media for the quack");