# Holiday Coverage Poll

A simple, clean Doodle-style poll to collect team availability for holiday coverage scheduling.

## Overview

This app helps collect availability from the engineering team for coverage during office closures (Thanksgiving, Christmas, and New Year weeks). It uses a poll system where each person votes on which days they're available, then an admin can review all responses to assign coverage.

## Features

- **Doodle-Style Voting**: Click once for "Yes", twice for "If needed", three times to reset
- **Two Views**:
  - **Voting view** (`?vote` URL parameter) for team members to submit availability
  - **Results view** (default) for admins to see all responses
- **12 Team Members**: Pre-loaded with the on-call rotation list
- **12 Coverage Days**: Automatically excludes holidays covered by support phone
- **Auto-Save**: All votes persist in browser localStorage
- **Export Results**: Download formatted text file showing everyone's availability
- **Share Link**: One-click copy of poll link to send to team

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

### For Admins: Collecting Votes

1. Open `index.html` in your browser (shows results view by default)
2. Click "📋 Copy Poll Link" to get the voting URL
3. Send the link to all team members via email or Teams
4. Team members will vote on their availability
5. Return to the results view to see all votes

### For Team Members: Voting

1. Click the poll link you received
2. Select your name from the dropdown
3. Click on days to indicate availability:
   - **One click** = Green (Yes, I can cover)
   - **Two clicks** = Yellow (If needed)
   - **Three clicks** = White (No/reset)
4. Click "Submit Vote" when done
5. You can return anytime to update your votes

### Viewing Results

1. Open `index.html` without `?vote` parameter (or just open it normally)
2. See a grid showing everyone's availability:
   - **Green dot** = Available
   - **Yellow dot** = If needed
   - **White dot** = No response
3. Click "Export Results" to download a text summary

### Exporting
1. Click "Export Results" to download a formatted summary
2. Shows availability by person and by day
3. Share with team or use to make coverage assignments

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
1. Edit the `teamMembers` array in [app.js](app.js:20-23)
2. Update the name dropdown options in [index.html](index.html:60-74)

### Changing Coverage Days/Dates
Edit the `coverageDays` array in [app.js](app.js:5-18) to adjust dates for different years

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
