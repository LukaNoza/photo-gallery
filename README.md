# PhotoGallery - Unsplash Image Browser

A modern photo gallery application built with Next.js, TypeScript, and the Unsplash API.

## Features

- **Home Page**: Browse 20 most popular images from Unsplash
- **Search**: Real-time search with debouncing (500ms delay)
- **Caching**: Smart caching system to avoid unnecessary API requests
- **History Page**: View all your previous search terms and revisit results
- **Infinite Scroll**: Custom implementation using Intersection Observer
- **Image Modal**: View full-size images with statistics (likes, downloads, views)
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Setup

1. Get your Unsplash API access key from [https://unsplash.com/developers](https://unsplash.com/developers)

2. Add your API key as an environment variable:
   - Go to Project Settings (gear icon in top right)
   - Navigate to Environment Variables
   - Add: `UNSPLASH_ACCESS_KEY` with your API key (note: NOT prefixed with NEXT_PUBLIC_)

3. The application will automatically use your API key securely on the server side

## Usage

### Home Page
- View popular images on load
- Use the search bar to find specific images
- Scroll down to load more images automatically
- Click any image to view details

### History Page
- See all your previous search terms
- Click any term to view those results again
- Clear your history with the "Clear History" button

### Image Modal
- Click any image to open the modal
- View full-size image
- See statistics: likes, downloads, and views
- Download the full-resolution image
- Close with the X button or ESC key

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API**: Unsplash REST API (server-side only for security)
- **Caching**: In-memory cache with 5-minute expiration
- **Storage**: LocalStorage for search history
- **Infinite Scroll**: Custom implementation (no external libraries)

## Architecture

- `/app` - Next.js pages and layouts
- `/app/api` - Server-side API routes (secure Unsplash API calls)
- `/components` - Reusable React components
- `/lib` - Utility functions, API calls, types
  - `api-client.ts` - Client-side API wrapper
  - `unsplash.ts` - Server-side Unsplash API integration
- `/hooks` - Custom React hooks (infinite scroll)
