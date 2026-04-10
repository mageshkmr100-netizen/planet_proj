// Shared authentication logic for Planet Ceres
// Handles user registration and login with localStorage

// Initialize storage key
const STORAGE_KEY = "ceres_citizens";

// Load users from localStorage
function loadUsers() {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Initialize with demo users if empty
function initializeDemoUsers() {
    let users = loadUsers();
    if (users.length === 0) {
        users = [
            {
                username: "StarlightExplorer",
                mobile: "9876543210",
                password: "ceres123",
                role: "tourist",
                joined: new Date().toLocaleString()
            },
            {
                username: "MageEldrin",
                mobile: "9988776655",
                password: "magic456",
                role: "citizen",
                joined: new Date().toLocaleString()
            },
            {
                username: "DragonFriend",
                mobile: "9123456789",
                password: "dragon77",
                role: "citizen",
                joined: new Date().toLocaleString()
            }
        ];
        saveUsers(users);
    }
}

// Register a new user
function registerUser(username, mobile, password) {
    const users = loadUsers();
    
    // Check if username exists
    if (users.find(u => u.username === username)) {
        return { success: false, message: "⚠️ A mystic with that name already resides on Ceres! Choose another." };
    }
    
    // Validate mobile (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
        return { success: false, message: "📞 Mobile number must be exactly 10 digits (Interstellar Code)." };
    }
    
    // Create new user
    const newUser = {
        username: username,
        mobile: mobile,
        password: password,
        role: "tourist_citizen",
        joined: new Date().toLocaleString(),
        credits: 100
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: `✨ Welcome to Planet Ceres, ${username}! ✨\nYou've received 100 Stardust Credits as a welcome gift!` };
}

// Login user
function loginUser(username, password) {
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        return { success: true, user: user };
    }
    return { success: false, message: "❌ Access denied! No matching credentials. Register first or check spell incantation." };
}

// Get current user from session (optional, for persistence)
let currentUser = null;

function setCurrentUser(user) {
    currentUser = user;
    if (user) {
        sessionStorage.setItem("ceres_current_user", JSON.stringify(user));
    } else {
        sessionStorage.removeItem("ceres_current_user");
    }
}

function getCurrentUser() {
    if (currentUser) return currentUser;
    const stored = sessionStorage.getItem("ceres_current_user");
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }
    return null;
}

// Logout function
function logout() {
    setCurrentUser(null);
    // Optionally redirect or update UI
    const welcomeMsg = document.createElement('div');
    welcomeMsg.innerText = `👋 You have left the realm of Ceres. Return soon!`;
    welcomeMsg.className = 'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-purple-800/90 text-white px-6 py-3 rounded-full shadow-2xl z-50 text-sm font-bold';
    document.body.appendChild(welcomeMsg);
    setTimeout(() => welcomeMsg.remove(), 3000);
}

// Initialize on page load
initializeDemoUsers();

// Export functions for global use
window.PlanetCeresAuth = {
    register: registerUser,
    login: loginUser,
    logout: logout,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser
};