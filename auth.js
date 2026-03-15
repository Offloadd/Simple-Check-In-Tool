// auth.js - Authentication

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, getDocs, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

window.handleLogin = async function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    
    if (!email || !password) {
        showAuthMessage('Please enter both email and password');
        return;
    }

    try {
        await signInWithEmailAndPassword(window.auth, email, password);
    } catch (error) {
        showAuthMessage('Error: ' + error.message);
    }
};

window.handleSignup = async function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    
    if (!email || !password) {
        showAuthMessage('Please enter both email and password');
        return;
    }

    try {
        await createUserWithEmailAndPassword(window.auth, email, password);
    } catch (error) {
        showAuthMessage('Error: ' + error.message);
    }
};

function showAuthMessage(message) {
    document.getElementById('authMessage').textContent = message;
}

window.resetPassword = async function() {
    const email = document.getElementById('emailInput').value;
    
    if (!email) {
        showAuthMessage('Please enter your email address first');
        return;
    }
    
    try {
        await sendPasswordResetEmail(window.auth, email);
        showAuthMessage('✓ Password reset email sent! Check your inbox (and spam folder).');
    } catch (error) {
        showAuthMessage('Error: ' + error.message);
    }
};

// Subscription checking
async function checkSubscription(userId) {
    try {
        const subscriptionsRef = collection(window.db, `customers/${userId}/subscriptions`);
        const subscriptionsSnapshot = await getDocs(subscriptionsRef);
        
        let hasActiveSubscription = false;
        subscriptionsSnapshot.forEach((docSnap) => {
            const subscription = docSnap.data();
            if (subscription.status === 'active' || subscription.status === 'trialing') {
                hasActiveSubscription = true;
            }
        });
        
        if (hasActiveSubscription) {
            document.getElementById('app').style.display = 'block';
            const subMsg = document.getElementById('subscriptionMessage');
            if (subMsg) subMsg.style.display = 'none';
            
            // Load data and render ONLY if subscription is active
            await loadFromFirestore();
            render();
            displayEntries();
        } else {
            document.getElementById('app').style.display = 'none';
            showSubscriptionMessage();
        }
    } catch (error) {
        console.error('Error checking subscription:', error);
        showSubscriptionMessage();
    }
}

function showSubscriptionMessage() {
    let subMessage = document.getElementById('subscriptionMessage');
    if (!subMessage) {
        subMessage = document.createElement('div');
        subMessage.id = 'subscriptionMessage';
        subMessage.style.cssText = 'text-align: center; padding: 3rem 2rem; max-width: 600px; margin: 2rem auto;';
        subMessage.innerHTML = `
            <h2 style="font-size: 1.75rem; margin-bottom: 1rem; font-family: inherit;">Subscribe to Access Offload</h2>
            <p style="margin-bottom: 2rem; font-size: 1.1rem; color: #6b7280;">Get access to all Offload tools with a monthly subscription.</p>
            <button onclick="createCheckoutSession()" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">Subscribe Now - $10/month</button>
        `;
        const authContainer = document.getElementById('authContainer');
        if (authContainer && authContainer.parentNode) {
            authContainer.parentNode.insertBefore(subMessage, authContainer.nextSibling);
        }
    }
    subMessage.style.display = 'block';
}

window.createCheckoutSession = async function() {
    const user = window.auth.currentUser;
    if (!user) {
        alert('Please log in first');
        return;
    }
    
    try {
        const checkoutSessionRef = doc(window.db, `customers/${user.uid}/checkout_sessions/${Date.now()}`);
        await setDoc(checkoutSessionRef, {
            price: 'price_1TBIHSPCe2rOpKWjzIqu8R5X',
            success_url: window.location.origin,
            cancel_url: window.location.origin,
            mode: 'subscription'
        });
        
        onSnapshot(checkoutSessionRef, (docSnap) => {
            const data = docSnap.data();
            if (data && data.url) {
                window.location.href = data.url;
            }
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        alert('Error starting checkout. Please try again.');
    }
};

window.handleLogout = async function() {
    try {
        await signOut(window.auth);
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// Auth state observer
onAuthStateChanged(window.auth, async (user) => {
    if (user) {
        state.user = user;
        document.getElementById('authContainer').style.display = 'none';
        
        // Check subscription before showing app and loading data
        await checkSubscription(user.uid);
    } else {
        state.user = null;
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('app').style.display = 'none';
    }
});
