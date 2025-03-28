# Steel Sons Masters Leaderboard 🏌️‍♂️

Live dynamic dashboard for the **Steel Sons Masters Pool** — built with React, Tailwind CSS, and powered by live Google Sheets data.

## 📊 Features
- Real-time leaderboard updates from Google Sheets
- Masters Leaderboard panel
- Summary leaderboard panel
- Sleek dark-mode UI inspired by Observable

## 📁 Data Source
Google Sheet: [Standings Tab](https://docs.google.com/spreadsheets/d/e/2PACX-1vSYatcTXJ14AC6WIOeGrNtl09tcgxmklbEpiqZ4CVgNRxuDR4dGboKTEvC3T275C6W81ZFRaeo2Gc1N/pub?gid=1281963062&single=true&output=csv)

## 🚀 Local Dev
```bash
git clone https://github.com/amd5181/steel-sons-masters-leaderboard.git
cd steel-sons-masters-leaderboard
npm install
npm run dev
```

## 🌍 Deploying to GitHub Pages
```bash
npm run build
git add dist -f
git commit -m "Add production build"
git subtree push --prefix dist origin gh-pages
```