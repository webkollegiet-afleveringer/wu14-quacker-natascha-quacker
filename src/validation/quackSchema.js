import { z } from "zod";
import { contentField, mediaField } from "./formFields.js";


export const quackSchema = z.object({
    content: contentField,
    media: mediaField,
})
// refine is used to validate that at least one of the fields (content or media) is provided when creating a quack, since a quack can be either text-based (content) or media-based (media), but not both empty
.refine((data) => {
    return data.content?.trim() || data.media?.trim();
}, {
    message: "Please provide either content or media"
});