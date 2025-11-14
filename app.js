// Holiday Coverage Scheduler App
// Simple vanilla JavaScript implementation

// Team roster
const teamMembers = [
    'Matt',
    'Robert',
    'Gerald',
    'Ellie',
    'Chris S',
    'Eri',
    'Joe',
    'Jeremy',
    'Jud',
    'Emil',
    'Chris E',
    'Jason'
];

// Coverage days (excluding holidays covered by support phone)
const coverageDays = [
    { id: 'mon-nov-25', date: 'Nov 25', fullDate: 'Monday, November 25, 2024' },
    { id: 'tue-nov-26', date: 'Nov 26', fullDate: 'Tuesday, November 26, 2024' },
    { id: 'wed-nov-27', date: 'Nov 27', fullDate: 'Wednesday, November 27, 2024' },
    { id: 'fri-nov-29', date: 'Nov 29', fullDate: 'Friday, November 29, 2024' },
    { id: 'mon-dec-23', date: 'Dec 23', fullDate: 'Monday, December 23, 2024' },
    { id: 'tue-dec-24', date: 'Dec 24', fullDate: 'Tuesday, December 24, 2024' },
    { id: 'thu-dec-26', date: 'Dec 26', fullDate: 'Thursday, December 26, 2024' },
    { id: 'fri-dec-27', date: 'Dec 27', fullDate: 'Friday, December 27, 2024' },
    { id: 'mon-dec-30', date: 'Dec 30', fullDate: 'Monday, December 30, 2024' },
    { id: 'wed-jan-01', date: 'Jan 1', fullDate: 'Wednesday, January 1, 2025' },
    { id: 'thu-jan-02', date: 'Jan 2', fullDate: 'Thursday, January 2, 2025' },
    { id: 'fri-jan-03', date: 'Jan 3', fullDate: 'Friday, January 3, 2025' }
];

// State management
let schedule = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeSelects();
    loadSchedule();
    attachEventListeners();
    updateSummary();
});

// Populate all select dropdowns with team members
function initializeSelects() {
    const selects = document.querySelectorAll('.person-select');

    selects.forEach(select => {
        // Add team members as options
        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            select.appendChild(option);
        });

        // Listen for changes
        select.addEventListener('change', (e) => {
            handleSelectionChange(e.target);
        });
    });
}

// Handle selection change
function handleSelectionChange(selectElement) {
    const day = selectElement.dataset.day;
    const person = selectElement.value;

    if (person) {
        schedule[day] = person;
    } else {
        delete schedule[day];
    }

    updateSummary();
    saveSchedule();
}

// Update the summary section
function updateSummary() {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = '';

    // Create a map of person -> days
    const personDays = {};

    coverageDays.forEach(day => {
        const person = schedule[day.id];
        if (person) {
            if (!personDays[person]) {
                personDays[person] = [];
            }
            personDays[person].push(day.date);
        }
    });

    // Show each team member and their assignment
    teamMembers.forEach(member => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';

        const days = personDays[member];
        if (days && days.length > 0) {
            summaryItem.classList.add('complete');
            summaryItem.innerHTML = `
                <strong>${member}</strong>
                <span>${days.join(', ')}</span>
            `;
        } else {
            summaryItem.classList.add('incomplete');
            summaryItem.innerHTML = `
                <strong>${member}</strong>
                <span class="text-danger">Not assigned</span>
            `;
        }

        summaryDiv.appendChild(summaryItem);
    });
}

// Save schedule to localStorage
function saveSchedule() {
    localStorage.setItem('holidayCoverageSchedule', JSON.stringify(schedule));
}

// Load schedule from localStorage
function loadSchedule() {
    const saved = localStorage.getItem('holidayCoverageSchedule');

    if (saved) {
        try {
            schedule = JSON.parse(saved);

            // Populate the selects with saved values
            Object.keys(schedule).forEach(day => {
                const select = document.querySelector(`select[data-day="${day}"]`);
                if (select) {
                    select.value = schedule[day];
                }
            });
        } catch (error) {
            console.error('Error loading schedule:', error);
            schedule = {};
        }
    }
}

// Attach event listeners to buttons
function attachEventListeners() {
    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => {
        saveSchedule();
        showNotification('Schedule saved successfully!', 'success');
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportToText);

    // Clear button
    document.getElementById('clearBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all assignments?')) {
            clearSchedule();
        }
    });
}

// Export schedule to text format
function exportToText() {
    let output = 'HOLIDAY COVERAGE SCHEDULE 2024-2025\n';
    output += 'Engineering Team\n';
    output += '=' .repeat(50) + '\n\n';

    output += 'Coverage Hours: 7am - 6pm CST\n';
    output += 'Contact: Phone, Email, or Teams\n\n';

    output += 'NOTE: Thanksgiving Day (Nov 28), Christmas Day (Dec 25), and\n';
    output += 'New Year\'s Eve (Dec 31) are covered by support phone rotation.\n';
    output += '=' .repeat(50) + '\n\n';

    // Group by week
    output += 'THANKSGIVING WEEK (Nov 24-28)\n';
    output += '-'.repeat(50) + '\n';
    ['mon-nov-25', 'tue-nov-26', 'wed-nov-27', 'fri-nov-29'].forEach(dayId => {
        const day = coverageDays.find(d => d.id === dayId);
        const person = schedule[dayId] || 'UNASSIGNED';
        output += `${day.fullDate}: ${person}\n`;
    });

    output += '\nCHRISTMAS WEEK (Dec 22-26)\n';
    output += '-'.repeat(50) + '\n';
    ['mon-dec-23', 'tue-dec-24', 'thu-dec-26', 'fri-dec-27'].forEach(dayId => {
        const day = coverageDays.find(d => d.id === dayId);
        const person = schedule[dayId] || 'UNASSIGNED';
        output += `${day.fullDate}: ${person}\n`;
    });

    output += '\nNEW YEAR WEEK (Dec 29 - Jan 2)\n';
    output += '-'.repeat(50) + '\n';
    ['mon-dec-30', 'wed-jan-01', 'thu-jan-02', 'fri-jan-03'].forEach(dayId => {
        const day = coverageDays.find(d => d.id === dayId);
        const person = schedule[dayId] || 'UNASSIGNED';
        output += `${day.fullDate}: ${person}\n`;
    });

    output += '\n' + '='.repeat(50) + '\n';
    output += 'SUMMARY BY PERSON\n';
    output += '='.repeat(50) + '\n';

    teamMembers.forEach(member => {
        const days = coverageDays.filter(day => schedule[day.id] === member);
        if (days.length > 0) {
            output += `${member}: ${days.map(d => d.date).join(', ')}\n`;
        } else {
            output += `${member}: NOT ASSIGNED\n`;
        }
    });

    // Create a downloadable text file
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holiday-coverage-schedule.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Schedule exported successfully!', 'success');
}

// Clear all schedule data
function clearSchedule() {
    schedule = {};
    localStorage.removeItem('holidayCoverageSchedule');

    // Reset all selects
    const selects = document.querySelectorAll('.person-select');
    selects.forEach(select => {
        select.value = '';
    });

    updateSummary();
    showNotification('Schedule cleared', 'warning');
}

// Show notification (simple alert for now)
function showNotification(message, type) {
    // For simplicity, using alert. Can be enhanced with custom toast notifications
    alert(message);
}
