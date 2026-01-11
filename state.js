// state.js - Application State

const state = {
    user: null,
    
    // Check-in state
    topicLabel: '',
    activeLifeArea: null,
    hijackingEvent: '',
    customTimestamp: '', // Optional custom timestamp (datetime-local format)
    
    // Slider values (1-20 scale, independent)
    stressorValue: 10,
    stabilizerValue: 10,
    opportunityValue: 10,
    
    // Detail notes for each zone
    stressorNotes: '',
    stabilizerNotes: '',
    opportunityNotes: '',
    
    // Life areas
    lifeAreas: {
        work: { label: 'Work', visible: true, custom: false },
        relationships: { label: 'Relationships', visible: true, custom: false },
        health: { label: 'Health', visible: true, custom: false },
        finances: { label: 'Finances', visible: true, custom: false },
        personal: { label: 'Personal Growth', visible: true, custom: false },
        home: { label: 'Home/Living', visible: true, custom: false }
    },
    
    entries: [],
    saveError: null,
    
    // View/Edit mode
    viewMode: false, // true = viewing saved entry (read-only), false = normal editing
    loadedEntryTimestamp: null // Track which entry is loaded
};

// Initialize app
function initApp() {
    console.log('State initialized - waiting for authentication');
}

// Call init
initApp();

// Viewing/editing state
state.isViewingEntry = false;
state.isEditingEntry = false;
state.currentEntryTimestamp = null;
