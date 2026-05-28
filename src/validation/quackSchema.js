import { z } from "zod";
import { contentField, mediaField } from "./formFields.js";


export const quackSchema = z.object({
    content: contentField,
    media: mediaField
}).refine((data) => {
    return Boolean(data.content?.length || data.media?.length);
}, {
    message: "Either text or media is required",
    path: ["content"]
});