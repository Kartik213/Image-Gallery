# Image Gallery

A metadata-driven React image gallery built with Vite and plain CSS. It uses a local JSON dataset and local assets from `public/images`.

## Live demo

[https://thump-n-assignment.vercel.app/](https://thump-n-assignment.vercel.app/)

## Completed requirements

- React functional components and hooks with Vite.
- No component, UI, gallery, carousel, lightbox, sort, or filter libraries.
- 18 local images across City & Culture, Heritage, and Nature categories.
- Responsive 3–6 column gallery grid at every viewport size, with up to six rows for the initial 18-image dataset and consistent image aspect ratios.
- Case-insensitive stable sorting by title and category, plus chronological date sorting, each ascending or descending.
- Custom popup controls for sorting and sort direction, matching the category filter UI.
- Multi-select category filtering with checkbox options generated from the dataset, visible result counts, empty-state handling, and reset controls.
- Combined filtering and sorting without either control resetting the other.
- Full-screen lightbox with the selected image, title, category, formatted date, position indicator, keyboard navigation, previous/next controls, boundary disabling, Escape-to-close, and click-outside closing.
- Image upload with title, category, date, existing/new category selection, image file validation, a 10 MB size limit, and error feedback.
- Long-press deletion on cards plus a visible delete control for non-touch users, with confirmation. Deleted images are removed from the current collection while their category options remain available.
- IndexedDB persistence for added/deleted images and `localStorage` persistence for filters, sorting, and categories.
- Local initial image URLs, so the gallery does not depend on third-party image hosting.

## Run locally

```bash
npm install
npm run dev
```

To serve the production build locally:

```bash
npm run build
npm start
```

Available checks:

```bash
npm run lint
npm run build
npm run preview
```

## Deployment

The project is deployed on Vercel at [https://thump-n-assignment.vercel.app/](https://thump-n-assignment.vercel.app/). To create or test a production build locally, run `npm run build` followed by `npm start`; `npm start` serves the generated `dist` directory with Vite Preview.
