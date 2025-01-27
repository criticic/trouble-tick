# trouble-tick

Have you ever wished to know if someone opened your email, or a link you shared? Trouble-tick is a tool that allows you to create short links, as well as allow you to track when and where they are clicked.

## Setup

1. Clone the repository
2. Run `bun install`
3. Fill the .env file.
4. For local development start a server with `bun run db:start`
5. Migrate the database with `bun run db:migrate`
6. Start the app with `bun run dev`

## Techstack

NextJS for the frontend, and the serverless functions.
Turso for the database. Drizzle as the ORM.
TailwindCSS & shadcn/ui for the styling.

## Features

- Create short links
- Create email tracking links
- Track when and where the links are clicked

## Todo

- GeoIP (have to find a free service)
- etc

Note: to embed the tracking pixel in an email, you can use an extension like [Insert and Send HTML with Gmail](https://chromewebstore.google.com/detail/insert-and-send-html-with/bcflbfdlpegakpncdgmejelcolhmfkjh?hl=en) if your mail client does not support embedding HTML.