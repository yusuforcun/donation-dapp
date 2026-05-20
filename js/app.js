// KONTRAT ADRESİNİ BURAYA YAZ (Remix'ten deploy edince alacaksın)
const CONTRACT_ADDRESS = "0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c";  

// ABI (sadece ihtiyacın olan fonksiyonlar)
const ABI = [
    {
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDonations",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "donorCount",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3, contract, account;

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
            
            const connectBtn = document.getElementById('connectButton');
            connectBtn.innerHTML = `🦊 ${account.slice(0,6)}...${account.slice(-4)}`;
            document.getElementById('donateBtn').disabled = false;
            
            // Hesap değiştiğinde güncelle
            window.ethereum.on('accountsChanged', function(accounts) {
                account = accounts[0];
                connectBtn.innerHTML = `🦊 ${account.slice(0,6)}...${account.slice(-4)}`;
                updateStats();
            });
            
            await updateStats();
            showStatus('✅ Wallet connected successfully!', 'success');
        } catch (error) {
            showStatus('❌ Connection failed: ' + error.message, 'error');
        }
    } else {
        showStatus('❌ Please install MetaMask!', 'error');
        alert('MetaMask not installed! Please install MetaMask extension.');
    }
}

async function updateStats() {
    if (!contract) return;
    
    try {
        const total = await contract.methods.totalDonations().call();
        const count = await contract.methods.donorCount().call();
        const balance = await contract.methods.getBalance().call();
        
        document.getElementById('total').innerHTML = `${web3.utils.fromWei(total, 'ether')} ETH`;
        document.getElementById('count').innerHTML = count;
        document.getElementById('balance').innerHTML = `${web3.utils.fromWei(balance, 'ether')} ETH`;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

async function donate() {
    const amountInput = document.getElementById('amount');
    const amount = amountInput.value;
    
    if (!amount || amount <= 0) {
        showStatus('❌ Please enter a valid amount!', 'error');
        return;
    }
    
    if (!account) {
        showStatus('❌ Please connect your wallet first!', 'error');
        return;
    }
    
    const weiAmount = web3.utils.toWei(amount, 'ether');
    
    try {
        showStatus('⏳ Processing your donation...', 'success');
        
        await contract.methods.donate().send({
            from: account,
            value: weiAmount,
            gas: 100000
        });
        
        showStatus('✅ Donation successful! Thank you for your support! 🙏', 'success');
        await updateStats();
        amountInput.value = '';
        
    } catch(err) {
        console.error(err);
        showStatus('❌ Error: ' + err.message, 'error');
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = message;
    statusDiv.className = `status ${type}`;
    
    // 5 saniye sonra temizle
    setTimeout(() => {
        if (statusDiv.innerHTML === message) {
            statusDiv.innerHTML = '';
            statusDiv.className = 'status';
        }
    }, 5000);
}

// Event listeners
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('donateBtn').addEventListener('click', donate);

// Sayfa yüklendiğinde kontrol et
window.addEventListener('load', () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectWallet();
    }
});