# Fixtures / Sample Data

This folder contains a small JSON fixture and a preview script so you can inspect the shape of the data without touching your database.

Files:
- `sampleData.json` — sample users and a challenge (Andrew & Makai, challenge ends 2025-12-31).
- `seedPreview.js` — Node script to print a quick summary of the data.

Run the preview script with Node (from repo root):

```bash
node fixtures/seedPreview.js
```

You can import `fixtures/sampleData.json` directly into tests or front-end mocks. IDs are simple placeholders and not inserted into the DB by this folder.
