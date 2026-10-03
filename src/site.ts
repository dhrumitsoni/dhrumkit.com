// Single source for site-wide identity. Pages, layouts, RSS and SEO read from here.
export const SITE = {
  url: 'https://dhrumkit.com',
  name: 'Dhrumit',
  title: 'Dhrumit · Data engineer',
  description: 'Dhrumit — data engineer. Writing on data infrastructure and software engineering.',
  feedTitle: 'Dhrumit — Writing',
  feedDescription: 'Data infrastructure and software engineering.',
  email: 'hi@dhrumkit.com',
  themeColor: '#1E4262',
  links: [
    { label: 'github', href: 'https://github.com/dhrumitsoni' },
    { label: 'linkedin', href: 'https://linkedin.com/in/dhrumitmandaliya' },
  ],
} as const;
