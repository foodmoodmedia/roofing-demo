# K&R Master Template System

Welcome to the Master Template System! This architecture allows you to spin up high-converting contractor landing pages in under 10 minutes.

## Features
- **Zero-Dependency Build Script**: Uses vanilla Node.js and Handlebars to compile lightning-fast static HTML. No React, no Next.js overhead.
- **Config-Driven**: Every site is controlled by a single JSON file. Edit the JSON to completely change the business name, phone, email, services, and color themes.
- **Modular Components**: The navbar, hero, footer, and CTA sections are all isolated in `/components` and `/sections`.

## How to Launch a New Client Site

### Step 1: Create a Config File
Navigate to `/config` and duplicate `base.json` into a new file, for example, `my_plumber.json`. Update all relevant details like phone numbers, services, and colors.

### Step 2: Build the Site
Open your terminal inside this `master-template-v1` directory and run:

```bash
npm install
node generate.js --config config/my_plumber.json --out ../../client-sites/my_plumber
```

### Step 3: Replace Placeholder Images
Navigate to `client-sites/my_plumber/images/`. You will see the standard placeholder images. Replace these with actual photos of your client's work (e.g. `roof-after.jpg`, `team.jpg`). Ensure the filenames remain the same, or update the source paths inside your `pages/*.hbs` files.

### Step 4: Deploy
Your final compiled website is 100% static HTML/CSS/JS and is located in the output folder. Drag and drop this folder onto Netlify, Vercel, or upload via FTP to GoDaddy. No server required.

## Included Niche Variations
We have pre-configured 3 niche variations for you to explore:
1. **HVAC (Comfort Climate)**
   - `node generate.js --config config/hvac.json --out dist/hvac`
2. **Dentist (Bright Smiles)**
   - `node generate.js --config config/dentist.json --out dist/dentist`
3. **Roofing (Elite Roofing)**
   - `node generate.js --config config/roofing.json --out dist/roofing`
