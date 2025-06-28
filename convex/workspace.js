import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const CreateWorkspace = mutation({
    args: {
        messages: v.array(v.object({
            role: v.string(),
            content: v.string()
        })),
        selectedEnv: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        try {
            const workspaceId = await ctx.db.insert('workspace', {
                messages: args.messages,
                selectedEnv: args.selectedEnv || 'react'
            });
            return workspaceId;
        } catch (error) {
            console.error('Error creating workspace:', error);
            throw new Error(`Failed to create workspace: ${error.message}`);
        }
    }
})

export const GetWorkspace = query({ 
    args: {
        workspaceId: v.id('workspace')
    },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db.get(args.workspaceId);
            return result;
        } catch (error) {
            console.error('Error getting workspace:', error);
            throw new Error(`Failed to get workspace: ${error.message}`);
        }
    }
})

export const UpdateWorkspace = mutation({
    args: {
        workspaceId: v.id('workspace'),
        messages: v.array(v.object({
            role: v.string(),
            content: v.string()
        })),
    },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db.patch(args.workspaceId, {
                messages: args.messages
            });
            return result;
        } catch (error) {
            console.error('Error updating workspace:', error);
            throw new Error(`Failed to update workspace: ${error.message}`);
        }
    }
})

export const UpdateFiles = mutation({
    args: {
        workspaceId: v.id('workspace'),
        files: v.any(),
    },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db.patch(args.workspaceId, {
                fileData: args.files
            });
            return result;
        } catch (error) {
            console.error('Error updating files:', error);
            throw new Error(`Failed to update files: ${error.message}`);
        }
    }
})