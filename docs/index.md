# feuerundflamme.xyz

Website for **Bündnis Feuer & Flamme**, a community initiative at the Dragonerareal in Berlin-Kreuzberg.

---

## How to add a new event

Create a new file in `_posts/` named like this:

```
YYYY-MM-DD-event-name.markdown
```

For example: `_posts/2025-06-15-keramiktreff.markdown`

Start the file with this header, then write the event text below it:

```
---
title: Your Event Title
date: 2025-06-15
---

Write your event description here.
```

The event will appear automatically on the homepage.

---

## How to add images to an event

1. Create a folder inside `assets/images/posts/` named exactly like your post file (without the `.markdown`):
   ```
   assets/images/posts/2025-06-15-keramiktreff/
   ```

2. Drop your photos (`.jpg` or `.png`) into that folder.

3. If you are running the website locally and want to preview the post, run the image processing script once:
   ```bash
   npm run process-images
   ```
   This generates the optimized versions that the site uses.

The first image (alphabetically) becomes the tile cover on the homepage. All images appear in a gallery on the event page.

---

## How to add captions to images

In the post header, add a `gallery` section:

```
---
title: Your Event Title
date: 2025-06-15
gallery:
  description: An overall description shown below the gallery
  images:
    - Caption for the first image
    - Caption for the second image
---
```

---

## Running the site locally

You need Ruby (3.4+) and Node (24+) installed.

```bash
npm install
bundle install
bundle exec jekyll serve
```

Then open [http://localhost:4000](http://localhost:4000) in your browser.

## Deploying the site

Push your changes to the `main` branch on GitHub. The site will rebuild and go live automatically within a minute or two, that is it, there is no extra steps needed. The whole hosting is handled by GitHub Pages.

---

## How it works?

The site is built with [Jekyll](https://jekyllrb.com/), a tool that turns plain text files into a website. You write content in simple `.markdown` files, and Jekyll assembles the pages using the layouts and styles in the repo.

When you push to GitHub, GitHub Pages runs Jekyll automatically and publishes the result at feuerundflamme.xyz.

Images get a bit of extra treatment: the `npm run process-images` script creates several smaller, optimized versions of each photo so the site loads fast on phones and slow connections. There is no needs to run this locally before you push new images as the publishing pipeline is going to do it.
