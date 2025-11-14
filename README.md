# Holiday Coverage Scheduler

A simple, clean web app to manage holiday coverage scheduling for the engineering team.

## Overview

This app helps coordinate coverage during office closures (Thanksgiving, Christmas, and New Year weeks). It automatically handles the 12 days that need coverage across the team (excluding holidays covered by the support phone rotation).

## Features

- **Simple Interface**: Clean, Microsoft 365-inspired design
- **12 Team Members**: Pre-loaded with the on-call rotation list
- **12 Coverage Days**: Automatically excludes holidays covered by support phone
- **Auto-Save**: Schedule data persists in browser localStorage
- **Export**: Download schedule as a formatted text file
- **Coverage Summary**: Visual overview showing each person's assigned day(s)

## Coverage Details

### Hours
- **7am - 6pm CST** during your coverage day

### Requirements
- Must be reachable by phone, email, or Teams
- Doesn't require staying online all day, just being available

### Holidays Excluded
These days are covered by whoever holds the support phone:
- Thanksgiving Day (Nov 28)
- Christmas Day (Dec 25)
- New Year's Eve (Dec 31)

## How to Use

### Setup
1. Clone this repository
2. Open `index.html` in any modern web browser
3. That's it! No build process, no dependencies.

### Assigning Coverage
1. Select a person from the dropdown for each day
2. The schedule auto-saves to your browser
3. Check the "Coverage Summary" section to see who's assigned what

### Exporting
1. Click "Export to Text" to download a formatted schedule
2. Share the text file via email or Teams
3. Add coverage days to SharePoint calendar as "[Name] Holiday Coverage"

### Clearing
1. Click "Clear All" to reset the entire schedule
2. Use the "Save Schedule" button to manually trigger a save (happens automatically on selection changes)

## Technical Details

### Stack
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: No frameworks or dependencies
- **localStorage**: Client-side data persistence

### Browser Compatibility
Works on all modern browsers:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

### File Structure
```
on-call-scheduling-app/
├── index.html      # Main HTML structure
├── styles.css      # All styling (Microsoft 365 inspired)
├── app.js          # Application logic
└── README.md       # This file
```

## Customization

### Adding/Removing Team Members
Edit the `teamMembers` array in [app.js](app.js:6-19):
```javascript
const teamMembers = [
    'Matt',
    'Robert',
    // ... add or remove names here
];
```

### Changing Coverage Days/Dates
Edit the `coverageDays` array in [app.js](app.js:21-34) to adjust dates for different years:
```javascript
const coverageDays = [
    { id: 'mon-nov-25', date: 'Nov 25', fullDate: 'Monday, November 25, 2024' },
    // ... modify as needed
];
```

### Styling
All colors and design tokens are defined as CSS custom properties in [styles.css](styles.css:15-28):
```css
:root {
    --primary-color: #0078d4;
    --primary-hover: #106ebe;
    /* ... adjust as needed */
}
```

## Deployment Options

### Option 1: SharePoint (Recommended)
1. Upload `index.html`, `styles.css`, and `app.js` to a SharePoint document library
2. Create a new SharePoint page
3. Add a "File viewer" web part pointing to `index.html`
4. Publish the page

### Option 2: Simple Web Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

### Option 3: GitHub Pages
1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access at `https://yourusername.github.io/on-call-scheduling-app`

## Future Enhancements

Potential improvements to consider:
- Microsoft Teams integration for notifications
- Export to Outlook calendar format (.ics)
- Email template generator
- Multi-year support
- Drag-and-drop assignment
- Mobile app version
- SharePoint list integration

## Support

For issues or questions:
- Check the repository issues
- Review the code comments in `app.js`
- Contact the engineering team lead

## License

Internal use only for the engineering team.
