// Holiday Coverage Poll App
// Doodle-style voting system

// ============================================
// FIREBASE CONFIGURATION
// ============================================
// TODO: Replace with your Firebase project credentials
// Get these from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyCP89elvSeGIzVgV_n-k-DWBQDxCFPreLQ",
    authDomain: "holiday-schedule-coverage.firebaseapp.com",
    databaseURL: "https://holiday-schedule-coverage-default-rtdb.firebaseio.com",
    projectId: "holiday-schedule-coverage",
    storageBucket: "holiday-schedule-coverage.firebasestorage.app",
    messagingSenderId: "764398854898",
    appId: "1:764398854898:web:5c35dce6bca64666a7266b"
};

// Initialize Firebase
let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    alert('Error connecting to database. Please check Firebase configuration.');
}

// ============================================
// DATA CONFIGURATION
// ============================================
// Coverage days (excluding holidays covered by support phone)
const coverageDays = [
    { id: 'mon-nov-24', label: 'Nov 24' },
    { id: 'tue-nov-25', label: 'Nov 25' },
    { id: 'wed-nov-26', label: 'Nov 26' },
    { id: 'fri-nov-28', label: 'Nov 28' },
    { id: 'mon-dec-22', label: 'Dec 22' },
    { id: 'tue-dec-23', label: 'Dec 23' },
    { id: 'wed-dec-24', label: 'Dec 24' },
    { id: 'fri-dec-26', label: 'Dec 26' },
    { id: 'mon-dec-29', label: 'Dec 29' },
    { id: 'tue-dec-30', label: 'Dec 30' },
    { id: 'thu-jan-01', label: 'Jan 1' },
    { id: 'fri-jan-02', label: 'Jan 2' }
];

// Team members
const teamMembers = [
    'Matt', 'Robert', 'Gerald', 'Ellie', 'Chris S', 'Eri',
    'Joe', 'Jeremy', 'Jud', 'Emil', 'Chris E', 'Jason'
];

// Vote states: 'no' (default), 'yes', 'maybe'
let currentVotes = {};

// All votes stored by person
let allVotes = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadVotesFromStorage();

    // Check if we're in voting mode or results mode
    const urlParams = new URLSearchParams(window.location.search);
    const isVoteMode = urlParams.has('vote');

    if (isVoteMode) {
        showVoteView();
    } else {
        showResultsView();
    }
});

// Show voting view
function showVoteView() {
    document.getElementById('voteView').classList.remove('hidden');
    document.getElementById('resultsView').classList.add('hidden');

    initializeVoting();
}

// Show results view
function showResultsView() {
    document.getElementById('voteView').classList.add('hidden');
    document.getElementById('resultsView').classList.remove('hidden');

    initializeResults();
}

// Initialize voting interface
function initializeVoting() {
    // Handle vote box clicks
    const voteBoxes = document.querySelectorAll('.vote-cell[data-day] .vote-box');
    voteBoxes.forEach(box => {
        box.addEventListener('click', handleVoteClick);
    });

    // Handle form submission
    document.getElementById('voteForm').addEventListener('submit', handleVoteSubmit);

    // Handle clear votes button
    document.getElementById('clearVoteBtn').addEventListener('click', handleClearVotes);

    // Try to load existing vote for selected person
    document.getElementById('voterName').addEventListener('change', loadExistingVote);
}

// Handle vote box click - cycle through states
function handleVoteClick(e) {
    const voteBox = e.target;
    const day = voteBox.closest('.vote-cell').dataset.day;

    // Cycle through states: no -> yes -> maybe -> no
    let currentState = currentVotes[day] || 'no';
    let nextState;

    if (currentState === 'no') {
        nextState = 'yes';
    } else if (currentState === 'yes') {
        nextState = 'maybe';
    } else {
        nextState = 'no';
    }

    currentVotes[day] = nextState;
    updateVoteBoxDisplay(voteBox, nextState);
}

// Update vote box visual state
function updateVoteBoxDisplay(voteBox, state) {
    voteBox.classList.remove('vote-yes', 'vote-maybe', 'vote-no');
    voteBox.classList.add(`vote-${state}`);
}

// Handle vote submission
function handleVoteSubmit(e) {
    e.preventDefault();

    const voterName = document.getElementById('voterName').value;

    if (!voterName) {
        alert('Please select your name');
        return;
    }

    // Save this person's votes
    allVotes[voterName] = { ...currentVotes };
    saveVotesToStorage();

    alert(`Thank you, ${voterName}! Your availability has been recorded.`);

    // Optionally redirect to results
    // window.location.href = window.location.pathname;
}

// Handle clear votes
function handleClearVotes() {
    if (confirm('Clear all your selections?')) {
        currentVotes = {};

        // Reset all vote boxes
        const voteBoxes = document.querySelectorAll('.vote-cell[data-day] .vote-box');
        voteBoxes.forEach(box => {
            updateVoteBoxDisplay(box, 'no');
        });
    }
}

// Load existing vote for a person
function loadExistingVote() {
    const voterName = document.getElementById('voterName').value;

    if (voterName && allVotes[voterName]) {
        // Load this person's existing votes
        currentVotes = { ...allVotes[voterName] };

        // Update UI
        const voteBoxes = document.querySelectorAll('.vote-cell[data-day] .vote-box');
        voteBoxes.forEach(box => {
            const day = box.closest('.vote-cell').dataset.day;
            const state = currentVotes[day] || 'no';
            updateVoteBoxDisplay(box, state);
        });
    } else {
        // Clear votes for new person
        handleClearVotes();
    }
}

// Initialize results view
function initializeResults() {
    // Handle share link button
    document.getElementById('shareLink').addEventListener('click', handleShareLink);

    // Handle export button
    document.getElementById('exportResults').addEventListener('click', handleExportResults);

    // Handle clear all data button
    document.getElementById('clearAllData').addEventListener('click', handleClearAllData);

    // Render results table
    renderResultsTable();
}

// Render the results table
function renderResultsTable() {
    const resultsTable = document.getElementById('resultsTable');

    // Create table structure
    let html = '<div class="results-grid">';

    // Header row
    html += '<div class="results-header">Name</div>';
    coverageDays.forEach(day => {
        html += `<div class="results-header">${day.label}</div>`;
    });

    // Data rows
    teamMembers.forEach(person => {
        html += '<div class="results-row">';
        html += `<div class="results-cell">${person}</div>`;

        coverageDays.forEach(day => {
            const vote = allVotes[person]?.[day.id] || 'no';
            const indicatorClass = vote === 'yes' ? 'yes' : vote === 'maybe' ? 'maybe' : 'no';
            html += `<div class="results-cell"><div class="vote-indicator ${indicatorClass}"></div></div>`;
        });

        html += '</div>';
    });

    html += '</div>';

    resultsTable.innerHTML = html;
}

// Handle share link
function handleShareLink() {
    const voteUrl = window.location.origin + window.location.pathname + '?vote';

    // Copy to clipboard
    navigator.clipboard.writeText(voteUrl).then(() => {
        alert('Poll link copied to clipboard!\n\n' + voteUrl);
    }).catch(() => {
        // Fallback if clipboard API fails
        prompt('Copy this link:', voteUrl);
    });
}

// Handle export results
function handleExportResults() {
    let output = 'HOLIDAY COVERAGE POLL RESULTS\n';
    output += 'Engineering Team • 2024-2025\n';
    output += '='.repeat(80) + '\n\n';

    output += 'Legend: [Y] = Yes, can cover | [M] = Maybe, if needed | [ ] = No response\n\n';

    // Create a table
    output += 'Name'.padEnd(15);
    coverageDays.forEach(day => {
        output += day.label.padEnd(8);
    });
    output += '\n' + '-'.repeat(15 + (coverageDays.length * 8)) + '\n';

    teamMembers.forEach(person => {
        output += person.padEnd(15);

        coverageDays.forEach(day => {
            const vote = allVotes[person]?.[day.id] || 'no';
            const symbol = vote === 'yes' ? '[Y]' : vote === 'maybe' ? '[M]' : '[ ]';
            output += symbol.padEnd(8);
        });

        output += '\n';
    });

    output += '\n' + '='.repeat(80) + '\n';
    output += 'AVAILABILITY SUMMARY BY DAY\n';
    output += '='.repeat(80) + '\n\n';

    coverageDays.forEach(day => {
        const yesVotes = teamMembers.filter(p => allVotes[p]?.[day.id] === 'yes');
        const maybeVotes = teamMembers.filter(p => allVotes[p]?.[day.id] === 'maybe');

        output += `${day.label}:\n`;
        output += `  Available (${yesVotes.length}): ${yesVotes.join(', ') || 'None'}\n`;
        output += `  If Needed (${maybeVotes.length}): ${maybeVotes.join(', ') || 'None'}\n\n`;
    });

    // Download as text file
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holiday-coverage-poll-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Handle clear all data
function handleClearAllData() {
    if (confirm('Are you sure you want to delete ALL votes? This cannot be undone.')) {
        allVotes = {};
        saveVotesToStorage();
        renderResultsTable();
        alert('All votes have been cleared.');
    }
}

// ============================================
// FIREBASE DATABASE FUNCTIONS
// ============================================

// Save votes to Firebase
function saveVotesToStorage() {
    if (!database) {
        console.error('Database not initialized');
        return;
    }

    database.ref('votes').set(allVotes)
        .then(() => {
            console.log('Votes saved to Firebase');
        })
        .catch((error) => {
            console.error('Error saving votes:', error);
            alert('Error saving votes. Please try again.');
        });
}

// Load votes from Firebase and listen for changes
function loadVotesFromStorage() {
    if (!database) {
        console.error('Database not initialized');
        return;
    }

    // Listen for real-time updates
    database.ref('votes').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            allVotes = data;
            console.log('Votes loaded from Firebase:', allVotes);

            // Update UI if we're in results view
            if (!document.getElementById('resultsView').classList.contains('hidden')) {
                renderResultsTable();
            }
        } else {
            allVotes = {};
            console.log('No votes found in database');
        }
    }, (error) => {
        console.error('Error loading votes:', error);
        allVotes = {};
    });
}
