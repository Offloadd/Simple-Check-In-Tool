// state.js - Application State

const state = {
    user: null,
    
    // Check-in state
    topicLabel: '',
    activeLifeArea: null,
    hijackingEvent: '',
    
    // Percentage sliders (always sum to 100%)
    stressorPercent: 34,      // Default split
    stabilizerPercent: 33,
    opportunityPercent: 33,
    
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
    saveError: null
};

// Initialize app
function initApp() {
    console.log('State initialized - waiting for authentication');
}

// Call init
initApp();
