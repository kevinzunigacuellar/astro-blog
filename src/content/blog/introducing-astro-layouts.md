---
title: Introducing astro-layouts, my first npm package
description: I wrote and published my first npm package "astro-layouts". Here some details about how I got the idea and how it works
pubDate: 2022-11-20
hero: "./astro_npm.png"
heroAlt: "The logo of Astro and npm"
---

Today I am excited to announce my first npm package `astro-layouts`. It injects a layout property into MD and MDX files frontmatter. This allows users to use layouts in Astro without having to define them for each page in the frontmatter.

## Idea and motivation

I got the idea for this package when I was helping people in the Astro Discord server. I noticed that a lot of people were struggling with defining layouts specially when they had a lot of pages. 

I wanted to make it easier for them so I decided to create a package that would allow them to define layouts from the Astro config file using glob patters. This way, they could define a layout once and use it in all the pages that they wanted.

## How it works

The package uses glob patterns to match the page with the layout. It then injects the layout property into the frontmatter of the page. It uses `picomatch` in the background to match the glob patterns.

## Installation

To install the package, you can run the following command:

```bash
npm install astro-layouts
```

## Usage

To use the package, you need to add it to the Astro config file in the remark plugin section. 

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import astroLayouts from "astro-layouts";

const layoutOptions = {
  "pages/**/*": "/src/layouts/Layout.astro",
};

export default defineConfig({
  markdown: {
    remarkPlugins: [[astroLayouts, layoutOptions]],
  },
});
```

The `layoutOptions` object is where you define the glob pattern and the layout that you want to use. 

- The `key` is the glob pattern to the files you would like to select 
- The `value` is the absolute path to the layout component.

You can get as specific as you want with glob patterns. For example, you can use:

- `pages/blog/**/*.md` to match all markdown files the pages in the blog folder.
- `pages/blog/**/*.mdx` to match all MDX files the pages in the blog folder.
- `pages/projects/*` to match all top level files in the blog folder.
- `pages/**/*` to match all files in the pages folder.

You can target any file in the `src` folder. For example, if you have your content in the `src/content` folder, you can use:

```js
const layoutOptions = {
  "content/**/*": "/src/layouts/Layout.astro",
};
```

If you have aliases defined in your `tsconfig.json` you can use them to make layout paths shorter.

```json title="tsconfig.json"
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@layouts/*": ["src/layouts/*"],
    },
  }
}

```

Then you can use aliases in the `layoutOptions`

```js
const layoutOptions = {
  "pages/**/*": "@layouts/Layout.astro",
};
```

## Final thoughts

I hope you find this package useful. If you have any questions or suggestions, feel free to raise an issue on [GitHub](https://github.com/kevinzunigacuellar/astro-layouts). I would apreciate any feedback. Also, if you like the package, please consider giving it a star. 

I had a lot of fun writing this package. I learned a lot about how npm packages work and how to publish them. I'm excited to write more packages in the future. Thank you for reading 🥰!