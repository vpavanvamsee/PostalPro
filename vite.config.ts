name: Deploy PostalPro to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      # 1. Build Root App (PostalPro)
      - name: Build Root Project
        run: |
          npm install
          npm run build

      # 2. Build PLI Leads into dist/plileads
      - name: Build PLI Leads
        if: hashFiles('public/plileads/package.json') != ''
        run: |
          cd public/plileads
          npm install
          npm run build
          mkdir -p ../../dist/plileads
          cp -r dist/* ../../dist/plileads/
          cd ../..

      # 3. Build TD Bill into dist/tdbill
      - name: Build TD Bill
        if: hashFiles('public/tdbill/package.json') != ''
        run: |
          cd public/tdbill
          npm install
          npm run build
          mkdir -p ../../dist/tdbill
          cp -r dist/* ../../dist/tdbill/
          cd ../..

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
