import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string()
    }),
    workspace: defineTable({
        messages: v.array(v.object({
            role: v.string(),
            content: v.string()
        })),
        fileData: v.optional(v.any()),
        selectedEnv: v.optional(v.string()),
    })
});