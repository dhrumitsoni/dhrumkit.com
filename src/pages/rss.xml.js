import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/posts';
import { SITE } from '../site';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.feedTitle,
    description: SITE.feedDescription,
    site: context.site,
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.date, description: p.data.dek, link: postUrl(p) })),
  });
}
