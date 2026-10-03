import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Published posts, newest first. Drafts are visible in `astro dev` only.
export const getPosts = async () =>
  (await getCollection('posts', (p) => import.meta.env.DEV || !p.data.draft))
    .sort((a, b) => +b.data.date - +a.data.date);

export const postUrl = (p: Post) => `/writing/${p.id}/`;
