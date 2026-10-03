// Adds `readingTime` (e.g. "4 min") to each post's remarkPluginFrontmatter.
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export const remarkReadingTime = () => (tree, { data }) => {
  const mins = Math.max(1, Math.round(getReadingTime(toString(tree)).minutes));
  data.astro.frontmatter.readingTime = `${mins} min`;
};
