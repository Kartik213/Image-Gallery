# Offline Image Gallery

A metadata-driven, offline-first image gallery built with React and Vite.

The application allows users to browse, filter, sort, upload, preview, and delete images while persisting user data locally in the browser. It does not require a backend or third-party image hosting.

## Live Demo

## Features

- **Responsive gallery** — 3–6 column image grid with consistent image aspect ratios.
- **Multi-select filtering** — Filter images by category with dynamically generated category options.
- **Sorting** — Sort by title, category, or date in ascending or descending order.
- **Combined filtering and sorting** — Filtering and sorting work independently and can be applied together.
- **Full-screen lightbox** — Preview images with metadata, position indicator, previous/next navigation, and keyboard controls.
- **Image uploads** — Add images with a title, category, and date.
- **Category management** — Select an existing category or create a new one while uploading.
- **Upload validation** — Validates image files and enforces a 10 MB size limit.
- **Image deletion** — Delete images using long-press on touch devices or a visible delete control on other devices.
- **Persistent image storage** — Added and deleted images are persisted using IndexedDB.
- **Persistent UI state** — Filters, sorting, and categories are persisted using localStorage.
- **Client-side only** — No backend or external image hosting is required.
- **Keyboard interactions** — Lightbox navigation and closing can be controlled from the keyboard.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- IndexedDB
- localStorage

## Architecture

The application is entirely client-side and does not depend on a backend.

```text
                         React UI
                            │
                            ▼
                    Gallery State
                     ┌──────┴──────┐
                     │             │
                     ▼             ▼
                 IndexedDB    localStorage
                     │             │
              ┌──────┴──────┐   ┌──┴───────────┐
              │             │   │              │
          Image data     Metadata Filters     Sorting
          User uploads              │              │
          Deletions                 └──────┬───────┘
                                           │
                                           ▼
                                   Persistent UI State

```

## Installation & Running Locally

### Prerequisites

Make sure the following are installed on your system:

- [Node.js](https://nodejs.org/) — v18 or later recommended
- npm — included with Node.js
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Kartik213/offline-image-gallery.git
cd offline-image-gallery