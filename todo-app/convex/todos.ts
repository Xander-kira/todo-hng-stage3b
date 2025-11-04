import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query('todos').withIndex('by_order').order('asc').collect(),
});

export const get = query({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const create = mutation({
  args: { title: v.string(), description: v.optional(v.string()), dueDate: v.optional(v.number()) },
  handler: async (ctx, { title, description, dueDate }) => {
    const count = await ctx.db.query('todos').collect();
    await ctx.db.insert('todos', {
      title, description, dueDate,
      completed: false,
      order: count.length,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('todos'),
    patch: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      completed: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { id, patch }) => { await ctx.db.patch(id, patch); },
});

export const toggle = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    const t = await ctx.db.get(id);
    if (t) await ctx.db.patch(id, { completed: !t.completed });
  },
});

export const remove = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});

export const reorder = mutation({
  args: { ids: v.array(v.id('todos')) },
  handler: async (ctx, { ids }) => {
    await Promise.all(ids.map((id, i) => ctx.db.patch(id, { order: i })));
  },
});
