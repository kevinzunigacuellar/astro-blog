---
title: Add dark mode to Astro with Tailwind CSS
description: In this guide, you will learn how to add perfect dark mode to your Astro project using Tailwind CSS and the prefers-color-scheme media query
pubDate: 2022-05-04
updatedDate: 2023-03-13
hero: "./astro_dark.png"
heroAlt: "The logo of Astro and Tailwind CSS"
---

A great way to make your website more accessible is to add dark mode. In this guide, we will learn how to implement perfect dark mode to your Astro project using TailwindCSS.

To create the UI we will use preact but feel free to use any other framework of your preference.

## 🧑‍💻 Getting started

Start a new Astro project:

```sh
npm create astro@latest
```

Install the tailwindcss and preact integrations:

```sh
npm install -D @astrojs/tailwind @astrojs/preact

npm install preact
```

Add both integrations to your `astro.config.mjs`

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [preact(), tailwind()],
});
```

Create a minimal tailwind config file in the root of your project. 

- Modify the `content` property to include all the files that contain your styles.

- Modify the `darkMode` property to `class` to enable dark mode.

```js title="tailwind.config.cjs"
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "class",
  theme: {},
  plugins: [],
};
```

## 👩‍🚀 Hands-on time

Astro has a feature to add inline scripts directly to your astro files. These scripts will run as soon as the html is loaded; therefore, preventing the [_flash of inaccurate color theme_](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/) which is a very common problem when implementing dark mode with hydration. You can read more about inline scripts in the [Astro documentation](https://docs.astro.build/en/reference/directives-reference/#isinline).

The following code retrieves the user's prefered theme and adds it to the html element. Feel free to copy/paste or modify this code snippet into your astro project. We will go over every line of code in the next paragraph.


```astro title="Layout.astro"
<script is:inline>
  const theme = (() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  })();

  if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
  window.localStorage.setItem("theme", theme);
</script>
```

`theme` is an immediately invoked function expression (IIFE) that returns the current theme based on the user's preference. 

Inside theme, the first if statement checks if the user has a previously saved theme in localStorage. If so, it returns set theme.

The second if statement checks if the user prefers dark mode. If so, it returns `dark`.

Finally, if none of the above conditions are met, it returns `light`.

Now that we have a theme defined, we can use it to add or remove `dark` to the html element and save the theme to localStorage.

## 💅 Making the UI

In Astro you can use any UI framework of your choice. For this example, I decided to use **Preact** because of its small size and performance.

The following code snippet renders a button to toggle between dark and light mode.

```tsx title="ThemeToggle.tsx"
import { useEffect, useState } from "preact/hooks";
import type { FunctionalComponent } from "preact";

export default function ThemeToggle(): FunctionalComponent {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");

  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button onClick={handleClick}>{theme === "light" ? "🌙" : "🌞"}</button>
  );
}
```

## 🧑‍🔧 Rendering components on the server

Regardless of the UI framework you use if you are using SSG, Astro will render your UI components on the server at build time and hydrate them on the client. This is a great feature because it makes your website faster, more accessible and SEO friendly.

However, this feature also comes with some tradeoffs. Because your components are rendered on the server, web APIs like `localStorage` or `window` are not available.

### Fallback initial state

To get around this problem, we can add a fallback initial state that will be used at build time and then change to the correct state after hydration.

```jsx
const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
```

The above code will try to get the theme from `localStorage` and if it's not available it will use `light` as the initial state.

Using a fallback initial state is the most common way to solve this problem. However, it creates a new problem called "client/server state missmatch." This problem happens when the initial state is different from the state after hydration.

This is not a big problem but it can be annoying for users specially if the state change is noticeable.

### Getting around client/server missmatch

One way to get around client and server missmatch is to add a mounted state. This state will make your component render wait until it is mounted to the DOM. This way all the web APIs will be available and the initial state will be the same as the state after hydration.

To implement this, we can use `useState` and `useEffect` hooks to create a mounted state. This will render a fallback UI or null until the component is mounted.

```jsx title="ThemeToggle.tsx"
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return <FallbackUI />; // or null;
}

return <button>{theme === "light" ? "🌙" : "🌞"}</button>;
```
