// auth.js - Authentication

import { signInWithEmailLink, isSignInWithEmailLink, sendSignInLinkToEmail, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Auth configuration
const actionCodeSettings = {
    url: window.location.href.split('?')[0],
    handleCodeInApp: true,
};

async function handleAuth() {
    const email = document.getElementById('emailInput').value;
    if (!email) {
        showAuthMessage('Please enter your email address');
        return;
    }

    try {
        await sendSignInLinkToEmail(window.auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        showAuthMessage('Check your email for the login link!');
    } catch (error) {
        showAuthMessage('Error: ' + error.message);
    }
}

function showAuthMessage(message) {
    document.getElementById('authMessage').textContent = message;
}

async function handleLogout() {
    try {
        await signOut(window.auth);
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Check for email link on page load
if (isSignInWithEmailLink(window.auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        email = window.prompt('Please provide your email for confirmation');
    }

    signInWithEmailLink(window.auth, email, window.location.href)
        .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((error) => {
            console.error('Sign-in error:', error);
        });
}

// Auth state observer
onAuthStateChanged(window.auth, async (user) => {
    if (user) {
        state.user = user;
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        
        await loadFromFirestore();
        render();
        displayEntries();
    } else {
        state.user = null;
        document.getElementById('authContainer').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }
});
