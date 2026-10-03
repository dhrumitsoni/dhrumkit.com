import { test, expect } from '@playwright/test';

const POST = '/writing/watermarks-and-the-price-of-waiting/';
const isMobile = (name: string) => name === 'mobile';

test.describe('pages', () => {
  test('home lists links and post count', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Dhrumit · Data engineer');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dhrumit');
    await expect(page.locator('.writing .count')).toHaveText(/^\d+ posts?$/);
    await expect(page.getByRole('link', { name: 'github' })).toHaveAttribute('href', /github\.com/);
    await expect(page.getByRole('link', { name: 'hi@dhrumkit.com' })).toHaveAttribute('href', 'mailto:hi@dhrumkit.com');
  });

  test('writing index links every post to a working page', async ({ page, request }) => {
    await page.goto('/writing/');
    const links = page.locator('.post-list a');
    expect(await links.count()).toBeGreaterThan(0);
    for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')!))) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });

  test('unknown URL serves the 404 page', async ({ page }) => {
    const res = await page.goto('/does-not-exist/');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nothing at this address.');
  });

  test('every page has SEO tags and a favicon', async ({ page, request }) => {
    for (const path of ['/', '/writing/', POST]) {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://dhrumkit.com${path}`);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    }
    expect((await request.get('/favicon.svg')).status()).toBe(200);
  });

  test('no console errors on any page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    for (const path of ['/', '/writing/', POST]) await page.goto(path, { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);
  });
});

test.describe('feeds', () => {
  test('RSS lists posts with absolute links', async ({ request }) => {
    const res = await request.get('/rss.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('<title>Dhrumit — Writing</title>');
    expect(xml).toContain(`<link>https://dhrumkit.com${POST}</link>`);
  });

  test('sitemap includes posts and skips 404', async ({ request }) => {
    const index = await request.get('/sitemap-index.xml');
    expect(index.status()).toBe(200);
    const xml = await (await request.get('/sitemap-0.xml')).text();
    expect(xml).toContain(`https://dhrumkit.com${POST}`);
    expect(xml).not.toContain('404');
  });
});

test.describe('post', () => {
  test.beforeEach(async ({ page }) => { await page.goto(POST); });

  test('header shows computed reading time', async ({ page }) => {
    await expect(page.locator('.meta-side')).toContainText(/\d+ MIN READ/);
  });

  test('contents rail tracks the section in view', async ({ page }, { project }) => {
    test.skip(isMobile(project.name), 'rail is wide-screen only');
    const rail = page.getByRole('navigation', { name: 'Contents' });
    await expect(rail).toBeVisible();
    await expect(rail.locator('a')).toHaveText(['01 Two clocks', '02 Late data']);
    await page.locator('#late-data').evaluate((h) => h.scrollIntoView({ block: 'start' }));
    await expect(rail.locator('a[href="#late-data"]')).toHaveAttribute('aria-current', 'true');
  });

  test('sidenotes are numbered automatically and announced', async ({ page }) => {
    const refs = page.locator('.sn-ref');
    const n = await refs.count();
    expect(n).toBeGreaterThan(0);
    const seq = Array.from({ length: n }, (_, i) => String(i + 1));
    await expect(refs).toHaveText(seq);
    for (const i of seq) await expect(page.getByRole('checkbox', { name: `Show note ${i}`, exact: true })).toHaveCount(1);
  });

  test('sidenote: margin on desktop, tap-to-expand on mobile', async ({ page }, { project }) => {
    const note = page.locator('.sidenote').first();
    if (!isMobile(project.name)) return expect(note).toBeVisible();
    await expect(note).toBeHidden();
    await page.locator('.sn-ref').first().click();
    await expect(note).toBeVisible();
    await page.locator('.sn-ref').first().click();
    await expect(note).toBeHidden();
  });

  test('opening one sidenote does not open the others', async ({ page }, { project }) => {
    test.skip(!isMobile(project.name), 'inline notes only below 1024px');
    // Inject a second note into the same paragraph to guard the sibling-selector fix.
    await page.evaluate(() => {
      const ref = document.querySelector('.sn-toggle')!;
      const group = [ref, ref.nextElementSibling!, ref.nextElementSibling!.nextElementSibling!];
      const clones = group.map((el) => el.cloneNode(true) as HTMLElement);
      clones[0].id = 'sn-test'; clones[0].setAttribute('aria-label', 'Show note test');
      clones[1].setAttribute('for', 'sn-test');
      group[2].after(...clones);
    });
    const notes = page.locator('.sidenote');
    await expect(notes).toHaveCount(2);
    await page.locator('.sn-ref').first().click();
    await expect(notes.nth(0)).toBeVisible();
    await expect(notes.nth(1)).toBeHidden();
  });

  test('code listing renders highlighted, unwrapped', async ({ page }) => {
    const listing = page.locator('.listing').first();
    await expect(listing.locator('.frame-title')).toContainText('LST. 01');
    await expect(listing.locator('pre.astro-code')).toHaveCSS('white-space', 'pre');
  });

  test('watermark figure frame fills the figure width', async ({ page }) => {
    const fig = await page.locator('figure.fig').boundingBox();
    const frame = page.locator('watermark-figure');
    await expect(frame).toHaveCSS('display', 'block');
    const box = await frame.boundingBox();
    expect(box!.width).toBeCloseTo(fig!.width, 0);
    expect(box!.height).toBeGreaterThan(300);
  });

  test('watermark figure responds to controls', async ({ page }, { project }) => {
    const fig = page.locator('watermark-figure');
    const fires = fig.locator('[data-el="fireS"]');
    const dropped = fig.locator('[data-el="late"]');
    await expect(fires).toHaveText('35.0');
    const before = Number(await dropped.textContent());

    if (isMobile(project.name)) {
      await fig.getByRole('button', { name: 'Increase bound' }).click();
      await expect(fires).toHaveText('36.0');
      await fig.getByRole('button', { name: '16s' }).click();
      await expect(fig.getByRole('button', { name: '16s' })).toHaveAttribute('aria-pressed', 'true');
    } else {
      await fig.locator('input[type="range"]').fill('16');
    }
    await expect(fires).toHaveText('46.0');
    expect(Number(await dropped.textContent())).toBeLessThan(before);

    // clamps at the bounds
    if (isMobile(project.name)) {
      await fig.getByRole('button', { name: 'Increase bound' }).click();
      await expect(fires).toHaveText('46.0');
    }
  });
});
