// ATM Machine with Advanced DSA Implementation

// ========================================
// CORE DSA DATA STRUCTURES
// ========================================

// 1. CUSTOM HASH TABLE
class HashTable {
    constructor(size = 100) {
        this.size = size;
        this.buckets = new Array(size).fill(null).map(() => []);
    }

    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
        }
        return Math.abs(hash) % this.size;
    }

    set(key, value) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value;
                return;
            }
        }
        
        bucket.push([key, value]);
    }

    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                return bucket[i][1];
            }
        }
        
        return null;
    }

    getAllEntries() {
        const entries = [];
        for (let bucket of this.buckets) {
            entries.push(...bucket);
        }
        return entries;
    }
}

// 2. LINKED LIST
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    append(data) {
        const newNode = { data, next: null };
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        
        this.size++;
    }

    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}

// 3. STACK
class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

// 4. QUEUE
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

// 5. BINARY SEARCH TREE
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(accountNumber, userData) {
        this.root = this.insertRecursive(this.root, accountNumber, userData);
    }

    insertRecursive(node, accountNumber, userData) {
        if (node === null) {
            return { accountNumber, userData, left: null, right: null };
        }

        if (accountNumber < node.accountNumber) {
            node.left = this.insertRecursive(node.left, accountNumber, userData);
        } else if (accountNumber > node.accountNumber) {
            node.right = this.insertRecursive(node.right, accountNumber, userData);
        }

        return node;
    }

    search(accountNumber) {
        return this.searchRecursive(this.root, accountNumber);
    }

    searchRecursive(node, accountNumber) {
        if (node === null || node.accountNumber === accountNumber) {
            return node;
        }

        if (accountNumber < node.accountNumber) {
            return this.searchRecursive(node.left, accountNumber);
        }

        return this.searchRecursive(node.right, accountNumber);
    }
}

// 6. SORTING ALGORITHMS
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i].date >= right[j].date) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

// ========================================
// GLOBAL VARIABLES
// ========================================

const userHashTable = new HashTable(50);
const transactionQueue = new Queue();
const undoStack = new Stack();
const userBST = new BinarySearchTree();

let currentUser = null;
let isAuthenticated = false;
let currentScreen = 'welcome';

// Sample user data
const initialUsers = [
    { accountNumber: "1234567890", pin: "1234", name: "John Doe", balance: 5000.00 },
    { accountNumber: "0987654321", pin: "5678", name: "Jane Smith", balance: 7500.00 },
    { accountNumber: "1122334455", pin: "1111", name: "Mike Johnson", balance: 12500.00 },
    { accountNumber: "2233445566", pin: "2222", name: "Sarah Wilson", balance: 3200.00 },
    { accountNumber: "3344556677", pin: "3333", name: "David Brown", balance: 8900.00 },
    { accountNumber: "4455667788", pin: "4444", name: "Emily Davis", balance: 15000.00 },
    { accountNumber: "5566778899", pin: "5555", name: "Robert Taylor", balance: 6800.00 },
    { accountNumber: "6677889900", pin: "6666", name: "Lisa Anderson", balance: 4200.00 },
    { accountNumber: "7788990011", pin: "7777", name: "James Martinez", balance: 11000.00 },
    { accountNumber: "8899001122", pin: "8888", name: "Maria Garcia", balance: 9500.00 }
];

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadUserData(); // Load saved data first
    initializeATM(); // Initialize fresh data only if no saved data exists
    updateStatus("Welcome! Please insert your card");
    
    setTimeout(() => {
        const pinInput = document.getElementById('pinInput');
        if (pinInput) {
            pinInput.focus();
        }
    }, 500);
});

function initializeATM() {
    // Only initialize if no data exists in hash table
    if (userHashTable.getAllEntries().length === 0) {
        console.log("Initializing fresh data structures...");
        
        // Clear any existing data
        userHashTable.buckets = new Array(userHashTable.size).fill(null).map(() => []);
        userBST.root = null;
        transactionQueue.items = [];
        undoStack.items = [];
        
        // Initialize with fresh data
        initialUsers.forEach(user => {
            const userWithTransactions = {
                ...user,
                transactions: new LinkedList(),
                transactionHistory: []
            };
            
            userHashTable.set(user.accountNumber, userWithTransactions);
            userBST.insert(user.accountNumber, userWithTransactions);
        });

        // Add sample transactions
        addSampleTransactions();
        
        console.log("Fresh data initialized. Users in hash table:", userHashTable.getAllEntries().length);
        console.log("Users:", userHashTable.getAllEntries().map(([acc, user]) => `${user.name} (PIN: ${user.pin})`));
        
        // Save the initial data
        saveUserData();
    } else {
        console.log("Using existing data from localStorage. Users in hash table:", userHashTable.getAllEntries().length);
    }
}

function addSampleTransactions() {
    const today = new Date();
    const dates = [
        new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)
    ];

    const sampleTransactions = [
        { type: 'Deposit', amount: 1000, date: dates[3], balance: 5000 },
        { type: 'Withdrawal', amount: -200, date: dates[2], balance: 4800 },
        { type: 'Transfer', amount: -500, date: dates[1], balance: 4300 },
        { type: 'Deposit', amount: 700, date: dates[0], balance: 5000 }
    ];

    initialUsers.forEach((user, index) => {
        const userData = userHashTable.get(user.accountNumber);
        if (userData) {
            sampleTransactions.forEach(transaction => {
                userData.transactions.append(transaction);
                userData.transactionHistory.push(transaction);
            });
        }
    });
}

// ========================================
// AUTHENTICATION
// ========================================

function enterPin() {
    const pinInput = document.getElementById('pinInput');
    const pin = pinInput.value;
    
    if (pin.length !== 4) {
        showError("Please enter a 4-digit PIN");
        return;
    }

    console.log("Attempting to authenticate with PIN:", pin);
    console.log("Available users:", userHashTable.getAllEntries().map(([acc, user]) => `${user.name} (PIN: ${user.pin})`));

    // Find user by PIN
    let foundUser = null;
    userHashTable.getAllEntries().forEach(([accountNumber, userData]) => {
        if (userData.pin === pin) {
            foundUser = userData;
            console.log("Found user:", userData.name);
        }
    });

    if (foundUser) {
        currentUser = foundUser;
        isAuthenticated = true;
        pinInput.value = '';
        showMenu();
        updateStatus(`Welcome, ${foundUser.name}!`);
        addResetButton();
    } else {
        console.log("No user found with PIN:", pin);
        showError("Invalid PIN. Please try again.");
        pinInput.value = '';
    }
}

// ========================================
// TRANSACTION PROCESSING
// ========================================

function processWithdraw() {
    const amountInput = document.getElementById('withdrawAmount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showError("Please enter a valid amount");
        return;
    }

    if (amount > currentUser.balance) {
        showError("Insufficient funds");
        amountInput.value = '';
        return;
    }

    const transaction = {
        type: 'Withdrawal',
        amount: -amount,
        date: new Date(),
        balance: currentUser.balance - amount
    };

    transactionQueue.enqueue(transaction);
    executeTransaction(transaction);
    amountInput.value = '';
    
    // Show success message in withdraw screen
    const withdrawScreen = document.getElementById('withdrawScreen');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = `Withdrawal successful! $${amount.toFixed(2)} withdrawn.`;
    successDiv.style.cssText = 'background: #4CAF50; color: white; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: center;';
    
    // Remove any existing success message
    const existingSuccess = withdrawScreen.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    withdrawScreen.insertBefore(successDiv, withdrawScreen.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
        showMenu();
    }, 7000);
}

function processDeposit() {
    const amountInput = document.getElementById('depositAmount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showError("Please enter a valid amount");
        return;
    }

    const transaction = {
        type: 'Deposit',
        amount: amount,
        date: new Date(),
        balance: currentUser.balance + amount
    };

    transactionQueue.enqueue(transaction);
    executeTransaction(transaction);
    amountInput.value = '';
    
    // Show success message in deposit screen
    const depositScreen = document.getElementById('depositScreen');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = `Deposit successful! $${amount.toFixed(2)} deposited.`;
    successDiv.style.cssText = 'background: #4CAF50; color: white; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: center;';
    
    // Remove any existing success message
    const existingSuccess = depositScreen.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    depositScreen.insertBefore(successDiv, depositScreen.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
        showMenu();
    }, 7000);
}

function processTransfer() {
    const recipientInput = document.getElementById('recipientAccount');
    const amountInput = document.getElementById('transferAmount');
    const recipientAccount = recipientInput.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showError("Please enter a valid amount");
        return;
    }

    if (amount > currentUser.balance) {
        showError("Insufficient funds");
        amountInput.value = '';
        return;
    }

    // Find recipient using BST
    const recipientNode = userBST.search(recipientAccount);
    if (!recipientNode) {
        showError("Recipient account not found");
        recipientInput.value = '';
        return;
    }

    const recipientData = recipientNode.userData;
    if (!recipientData) {
        showError("Recipient account not found");
        recipientInput.value = '';
        return;
    }

    // Create transfer transactions
    const withdrawalTransaction = {
        type: 'Transfer',
        amount: -amount,
        date: new Date(),
        balance: currentUser.balance - amount,
        recipient: recipientData.name
    };

    const depositTransaction = {
        type: 'Transfer',
        amount: amount,
        date: new Date(),
        balance: recipientData.balance + amount,
        sender: currentUser.name
    };

    transactionQueue.enqueue(withdrawalTransaction);
    transactionQueue.enqueue(depositTransaction);

    executeTransaction(withdrawalTransaction);
    executeTransaction(depositTransaction, recipientData);

    recipientInput.value = '';
    amountInput.value = '';
    
    // Show success message in transfer screen
    const transferScreen = document.getElementById('transferScreen');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = `Transfer successful! $${amount.toFixed(2)} sent to ${recipientData.name}.`;
    successDiv.style.cssText = 'background: #4CAF50; color: white; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: center;';
    
    // Remove any existing success message
    const existingSuccess = transferScreen.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    transferScreen.insertBefore(successDiv, transferScreen.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
        showMenu();
    }, 7000);
}

function executeTransaction(transaction, targetUser = currentUser) {
    // Save state for undo
    const previousState = {
        balance: targetUser.balance,
        transaction: transaction
    };
    undoStack.push(previousState);

    // Update balance
    targetUser.balance = transaction.balance;

    // Add to linked list
    targetUser.transactions.append(transaction);
    targetUser.transactionHistory.push(transaction);
    
    // Save data after each transaction
    saveUserData();
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================

function showMenu() {
    hideAllScreens();
    document.getElementById('menuScreen').style.display = 'block';
    currentScreen = 'menu';
}

function showBalance() {
    hideAllScreens();
    document.getElementById('balanceScreen').style.display = 'block';
    document.getElementById('balanceAmount').textContent = `$${currentUser.balance.toFixed(2)}`;
    currentScreen = 'balance';
}

function showWithdraw() {
    hideAllScreens();
    document.getElementById('withdrawScreen').style.display = 'block';
    currentScreen = 'withdraw';
}

function showDeposit() {
    hideAllScreens();
    document.getElementById('depositScreen').style.display = 'block';
    currentScreen = 'deposit';
}

function showTransfer() {
    hideAllScreens();
    document.getElementById('transferScreen').style.display = 'block';
    currentScreen = 'transfer';
}

function showMiniStatement() {
    hideAllScreens();
    document.getElementById('statementScreen').style.display = 'block';
    currentScreen = 'statement';
    displayTransactions();
}

function displayTransactions() {
    const statementList = document.getElementById('statementList');
    statementList.innerHTML = '';

    // Get transactions from linked list and sort them
    const transactions = currentUser.transactions.toArray();
    const sortedTransactions = mergeSort([...transactions]);

    if (sortedTransactions.length === 0) {
        statementList.innerHTML = '<div class="statement-item">No transactions found</div>';
        return;
    }

    // Add header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'statement-header';
    headerDiv.innerHTML = `
        <div class="header-info">
            <div class="account-info">
                <strong>Account: ${currentUser.accountNumber}</strong><br>
                <span>Name: ${currentUser.name}</span>
            </div>
            <div class="current-balance">
                <strong>Current Balance: $${currentUser.balance.toFixed(2)}</strong>
            </div>
        </div>
        <div class="statement-title">Mini Statement - Last ${sortedTransactions.length} Transactions</div>
    `;
    statementList.appendChild(headerDiv);

    // Add transactions
    sortedTransactions.forEach((transaction, index) => {
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'statement-item';
        
        const date = transaction.date.toLocaleDateString();
        const time = transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sign = transaction.amount >= 0 ? '+' : '';
        const isRecent = index < 3;
        
        // Create proper transaction description
        let description = transaction.type;
        if (transaction.type === 'Transfer') {
            if (transaction.amount < 0) {
                description = `Transfer to ${transaction.recipient || 'Unknown'}`;
            } else {
                description = `Transfer from ${transaction.sender || 'Unknown'}`;
            }
        }
        
        // Set color based on transaction type
        let transactionColor = '#333'; // default color
        if (transaction.type === 'Withdrawal') {
            transactionColor = '#d32f2f'; // red
        } else if (transaction.type === 'Deposit') {
            transactionColor = '#388e3c'; // green
        } else if (transaction.type === 'Transfer') {
            transactionColor = '#1976d2'; // blue
        }
        
        transactionDiv.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-type ${isRecent ? 'recent' : ''}" style="color: ${transactionColor}; font-weight: bold;">${transaction.type}</div>
                <div class="transaction-description" style="color: ${transactionColor};">${description} - $${Math.abs(transaction.amount).toFixed(2)}</div>
                <div class="transaction-date">${date} at ${time}</div>
            </div>
            <div class="transaction-details">
                <div class="transaction-amount ${transaction.amount >= 0 ? 'credit' : 'debit'}" style="color: ${transactionColor}; font-weight: bold;">
                    ${sign}$${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <div class="transaction-balance">Balance: $${transaction.balance.toFixed(2)}</div>
            </div>
        `;
        
        statementList.appendChild(transactionDiv);
    });
}

function backToMenu() {
    showMenu();
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    currentScreen = 'welcome';
    hideAllScreens();
    document.getElementById('welcomeScreen').style.display = 'block';
    updateStatus("Welcome! Please insert your card");
    clearAllInputs();
}

function hideAllScreens() {
    const screens = ['welcomeScreen', 'menuScreen', 'withdrawScreen', 'depositScreen', 'transferScreen', 'statementScreen', 'balanceScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = 'none';
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function setAmount(amount) {
    const targetInput = getTargetInput();
    if (targetInput) {
        targetInput.value = amount;
    }
}

function appendToInput(value) {
    const targetInput = getTargetInput();
    if (targetInput) {
        if (targetInput.id === 'pinInput') {
            if (targetInput.value.length < 4) {
                targetInput.value += value;
            }
        } else {
            targetInput.value += value;
        }
    }
}

function clearInput() {
    const targetInput = getTargetInput();
    if (targetInput) {
        targetInput.value = '';
    }
}

function backspace() {
    const targetInput = getTargetInput();
    if (targetInput && targetInput.value.length > 0) {
        targetInput.value = targetInput.value.slice(0, -1);
    }
}

function getTargetInput() {
    switch (currentScreen) {
        case 'welcome':
            return document.getElementById('pinInput');
        case 'withdraw':
            return document.getElementById('withdrawAmount');
        case 'deposit':
            return document.getElementById('depositAmount');
        case 'transfer':
            const recipientInput = document.getElementById('recipientAccount');
            const amountInput = document.getElementById('transferAmount');
            return recipientInput.value === '' ? recipientInput : amountInput;
        default:
            return null;
    }
}

function clearAllInputs() {
    const inputs = ['pinInput', 'withdrawAmount', 'depositAmount', 'transferAmount', 'recipientAccount'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

function updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function showError(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = 'status error';
        setTimeout(() => {
            statusElement.className = 'status';
            statusElement.textContent = `Welcome, ${currentUser.name}!`;
        }, 2000);
    }
}

function showSuccess(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = 'status success';
        setTimeout(() => {
            statusElement.className = 'status';
            statusElement.textContent = `Welcome, ${currentUser.name}!`;
        }, 2000);
    }
}

function addResetButton() {
    const menuScreen = document.getElementById('menuScreen');
    if (menuScreen) {
        const existingResetButton = menuScreen.querySelector('.menu-btn.reset');
        if (existingResetButton) {
            return;
        }
        
        const resetButton = document.createElement('button');
        resetButton.className = 'menu-btn reset';
        resetButton.innerHTML = '🔄 Reset All Data';
        resetButton.onclick = function() {
            if (confirm('Are you sure you want to reset all data? This will clear all transaction history and reset balances to original values.')) {
                resetAllData();
            }
        };
        menuScreen.querySelector('.menu-options').appendChild(resetButton);
    }
}

// ========================================
// DATA PERSISTENCE
// ========================================

function loadUserData() {
    const savedData = localStorage.getItem('atmData');
    if (savedData) {
        console.log("Loading data from localStorage...");
        const data = JSON.parse(savedData);
        
        // Clear existing structures
        userHashTable.buckets = new Array(userHashTable.size).fill(null).map(() => []);
        userBST.root = null;
        transactionQueue.items = [];
        undoStack.items = [];
        
        // Reconstruct hash table and all other structures
        Object.keys(data.users).forEach(accountNumber => {
            const userData = data.users[accountNumber];
            userData.transactions = new LinkedList();
            userData.transactionHistory.forEach(transaction => {
                transaction.date = new Date(transaction.date);
                userData.transactions.append(transaction);
            });
            
            userHashTable.set(accountNumber, userData);
            userBST.insert(accountNumber, userData);
        });
        
        console.log("Data loaded from localStorage. Users:", userHashTable.getAllEntries().length);
    } else {
        console.log("No saved data found in localStorage");
    }
}

function saveUserData() {
    const data = {
        users: {}
    };
    
    // Convert hash table to serializable format
    userHashTable.getAllEntries().forEach(([accountNumber, userData]) => {
        data.users[accountNumber] = {
            ...userData,
            transactions: null, // Don't save linked list
            transactionHistory: userData.transactionHistory
        };
    });
    
    localStorage.setItem('atmData', JSON.stringify(data));
    console.log('Data saved to localStorage');
}

function resetAllData() {
    localStorage.clear(); // Clear all localStorage keys
    location.reload();    // Reload the page for a fresh start
}

// ========================================
// DSA DEMONSTRATION
// ========================================

function demonstrateDSA() {
    console.log("=== DSA DEMONSTRATION ===");
    
    // Hash Table demonstration
    console.log("1. Hash Table Operations:");
    console.log("Users in hash table:", userHashTable.getAllEntries().length);
    
    // Linked List demonstration
    console.log("2. Linked List Operations:");
    if (currentUser) {
        console.log("Transaction count:", currentUser.transactions.size);
        console.log("Transactions:", currentUser.transactions.toArray());
    }
    
    // Stack demonstration
    console.log("3. Stack Operations:");
    console.log("Undo stack size:", undoStack.size());
    
    // Queue demonstration
    console.log("4. Queue Operations:");
    console.log("Transaction queue size:", transactionQueue.size());
    
    // BST demonstration
    console.log("5. Binary Search Tree Operations:");
    const allUsers = userHashTable.getAllEntries();
    console.log("Users in BST:", allUsers.length);
    
    // Sorting demonstration
    console.log("6. Sorting Algorithms:");
    if (currentUser && currentUser.transactionHistory.length > 0) {
        const sorted = mergeSort([...currentUser.transactionHistory]);
        console.log("Sorted transactions:", sorted.length);
    }
}

// Call DSA demonstration on page load
setTimeout(demonstrateDSA, 1000);