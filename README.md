# SEO Meta Tags Audit Tool

An interactive web tool for auditing and managing SEO meta tags (Title and Description) across a multi-language website. This tool helps identify keyword spam, emojis, and length issues in meta tags.

## Features

- 📊 **Interactive Table** - View all meta tags with current and proposed versions
- 🔍 **Smart Filtering** - Filter by status (Critical/Warning/OK), type (Title/Description), or search text
- ✅ **Approval Tracking** - Mark items as approved (stored in browser's localStorage)
- 📈 **Statistics** - Real-time stats showing Total, Critical, Warning, OK, and Approved counts
- 💾 **CSV Export** - Download audit data for spreadsheet analysis
- 📱 **Responsive Design** - Works on desktop and tablet displays

## Project Structure

```
seo-meta-audit-tool/
├── index.html              # Main entry point (loads data dynamically)
├── assets/
│   ├── css/
│   │   └── style.css       # Styling for the entire application
│   └── js/
│       └── app.js          # Application logic (SEOAuditApp class)
├── data/
│   └── meta-tags-part2.json # Data source with all meta tags
└── README.md               # This file
```

## How It Works

1. **index.html** - Clean HTML structure that loads external CSS and JS
2. **app.js** - `SEOAuditApp` class handles:
   - Loading meta tags from JSON file
   - Rendering the interactive table
   - Managing filters and search
   - Tracking approvals via localStorage
   - Exporting to CSV
3. **style.css** - Modular CSS with components for cards, tables, filters, and status indicators
4. **meta-tags-part2.json** - Data source containing all meta tag entries

## Data Format

The `data/meta-tags-part2.json` file contains meta tags in the following structure:

```json
{
  "version": "2.0",
  "locale": "uk",
  "part": 2,
  "title": "SEO Meta Tags Audit — Part 2",
  "description": "27 ключів з проблемами SEO",
  "status": "ВИКЛЮЧНО в мета тегах (без контентного використання)",
  "tags": [
    {
      "type": "title",
      "key": "uniqueKeyName",
      "current": "Current text with issues",
      "proposed": "Optimized text without issues",
      "issues": ["Issue1", "Issue2"],
      "status": "critical"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Version of the data format |
| `locale` | string | Language locale (e.g., 'uk', 'en', 'pl') |
| `part` | number | Audit part number (1, 2, etc.) |
| `title` | string | Display title for the audit |
| `description` | string | Brief description of what's included |
| `status` | string | Overall status or notes about the audit |
| `tags` | array | Array of meta tag entries |

### Tag Object Fields

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `type` | string | `"title"` or `"desc"` | Meta tag type |
| `key` | string | any string | Unique identifier for the translation key |
| `current` | string | any string | Current meta tag text (with issues) |
| `proposed` | string | any string | Suggested optimized version |
| `issues` | array | string[] | List of detected issues |
| `status` | string | `"critical"`, `"warning"`, `"ok"` | Severity level |

### Issue Types

Common issue tags:
- `Emoji: [emoji list]` - Detected emojis (e.g., "Emoji: ➣✅💰")
- `Redundant: [phrase]` - Redundant phrases (e.g., "Redundant: в Україні та інших країнах")
- `Title Too Long` - Title exceeds 60 characters
- `Title Too Short` - Title under 30 characters
- `Desc Too Long` - Description exceeds 160 characters
- `Desc Too Short` - Description under 70 characters
- `Keyword Spam` - Excessive repetition of keywords

## How to Update Data

### Adding a New Meta Tag Entry

1. Open `data/meta-tags-part2.json` in your text editor
2. Locate the `tags` array
3. Add a new object following this template:

```json
{
  "type": "title",
  "key": "myNewKey",
  "current": "Original text with issues ➣ more words more words",
  "proposed": "Optimized text without issues",
  "issues": ["Emoji: ➣", "Redundant: more words"],
  "status": "critical"
}
```

4. Save the file
5. Reload the web page in your browser - changes will appear immediately

### Editing an Existing Entry

1. Find the entry by its `key` field
2. Modify the relevant fields (`current`, `proposed`, `issues`, `status`)
3. Save and reload the page

### Example: Updating Multiple Entries

```json
{
  "tags": [
    {
      "type": "desc",
      "key": "bakeryDesc",
      "current": "➣ Bakery software ➣ solutions",
      "proposed": "Bakery software solutions and management system",
      "issues": ["Emoji: ➣", "Keyword Spam"],
      "status": "critical"
    },
    {
      "type": "title",
      "key": "bakeryTitle",
      "current": "Bakery",
      "proposed": "Bakery Management Software",
      "issues": ["Title Too Short"],
      "status": "critical"
    }
  ]
}
```

## Evaluation Criteria

The tool uses these standards to evaluate meta tags:

| Metric | Type | Good | Warning | Bad |
|--------|------|------|---------|-----|
| **Length** | Title | 30-60 chars | 25-29 or 61-65 | <25 or >65 |
| **Length** | Description | 70-160 chars | 60-69 or 161-170 | <60 or >170 |
| **Emojis** | Both | None | - | Any emoji present |
| **Spam** | Both | Single mention | - | Multiple repeats |

## Using the Interface

### Filtering

- **Status Filter**: Show only Critical, Warning, or OK entries
- **Type Filter**: Show only Title or Description entries
- **Search**: Enter text to search across keys and content
- **Reset Filters**: Clear all filters to see all entries

### Approvals

- Click the "Approve" button to mark an item as approved
- Approved items are highlighted in green and marked with "✓ OK"
- Approvals are saved in browser's localStorage (persistent across sessions)
- Use "Скинути все" (Reset All) to clear all approvals

### Exporting

- Click "Експорт CSV" to download audit data
- CSV includes: Key, Type, Current text, Current length, Proposed text, Proposed length, Status, Issues, and Approval status
- Open in Excel or Google Sheets for further analysis

## Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

```bash
# Navigate to the project directory
cd /path/to/seo-meta-audit-tool

# Initialize git repo (if not already done)
git init
git remote add origin https://github.com/your-username/seo-meta-audit-tool.git
```

### Step 2: Configure for GitHub Pages

GitHub Pages serves from the root of your repository by default. The project is already structured correctly:
- `index.html` is in the root
- Assets are in `/assets` subdirectory
- Data is in `/data` subdirectory

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Initial commit: SEO Meta Tags Audit Tool"
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Your site will be available at: `https://your-username.github.io/seo-meta-audit-tool/`

### Step 5: Update Content

To update the audit data:

1. Edit `data/meta-tags-part2.json` in your editor or GitHub's web interface
2. Commit and push changes
3. Changes will appear on GitHub Pages within seconds

## Creating Additional Audit Files

To add another audit (e.g., Part 1, Part 3), create additional JSON files:

```
data/
├── meta-tags-part1.json
├── meta-tags-part2.json  (current)
└── meta-tags-part3.json
```

Create a new HTML file for each audit, or modify the data URL:

```javascript
// In index.html, change the data URL:
const app = new SEOAuditApp('./data/meta-tags-part3.json');
```

Or add a dropdown to switch between audits:

```html
<select id="dataSource">
  <option value="./data/meta-tags-part1.json">Part 1</option>
  <option value="./data/meta-tags-part2.json">Part 2</option>
</select>

<script>
  let app;
  const dataSelect = document.getElementById('dataSource');

  function loadAudit(dataUrl) {
    app = new SEOAuditApp(dataUrl);
  }

  dataSelect.addEventListener('change', (e) => {
    loadAudit(e.target.value);
  });

  // Initialize with Part 1
  loadAudit('./data/meta-tags-part1.json');
</script>
```

## Running Locally

### ⚠️ CORS Error When Opening as File

If you see: `Access to fetch ... blocked by CORS policy`, it means you opened the HTML file directly (file:// protocol). Browsers block this for security.

### Solution 1: Python HTTP Server (Easiest - No Installation)

```bash
cd seo-meta-audit-tool
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

### Solution 2: Node.js Server

```bash
cd seo-meta-audit-tool
node server.js
```

Then open: **http://localhost:8000**

This project includes `server.js` for this purpose.

### Solution 3: VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` → "Open with Live Server"
3. Will automatically open in browser with correct protocol

## Troubleshooting

### Data Not Loading

- Check browser console (F12 → Console tab) for errors
- Verify JSON file path in index.html matches actual file location
- Ensure JSON is valid (use [JSONLint](https://jsonlint.com/) to validate)
- Check that the JSON file has proper `tags` array
- **Make sure you're using HTTP (http://localhost:8000) not FILE (file://)**

### localStorage Not Working

- localStorage is disabled in private/incognito mode
- Try clearing browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Try a different browser

### CSV Export Shows Garbled Text

- Ensure JSON file is saved as UTF-8 encoding
- Check that special characters (Ukrainian, etc.) are properly encoded in JSON

### Changes Not Visible After Updating JSON

- Hard refresh the page (Ctrl+F5 / Cmd+Shift+R)
- Clear browser cache
- Try in an incognito window

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser supporting ES6 and Fetch API

## Technical Notes

- Uses vanilla JavaScript (no frameworks)
- Data loaded via Fetch API
- Approvals and custom texts stored in browser's localStorage
- All processing happens client-side (no server required)
- Fully static and suitable for GitHub Pages or any static host

## File Size

- HTML: ~3.5 KB
- CSS: ~8 KB
- JS: ~8 KB
- JSON (27 entries): ~15 KB
- **Total: ~35 KB** (very lightweight)

## License

Use freely for your SEO auditing needs.

## Notes

- This tool is designed for Part 2 of SkyService's meta tag audit
- Contains 27 meta tag entries used exclusively in meta information (not in page content)
- Focus: Removing emojis, fixing keyword spam, and optimizing lengths
