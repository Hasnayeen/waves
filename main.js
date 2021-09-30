import Alpine from 'alpinejs'
import { ethers } from "ethers"
import contractABI from './WavePortal.json'

window.Alpine = Alpine

Alpine.data('app', () => ({
  currentAccount: null,
  contractAddress: '0xeF6f2742d10bE356fDB6b18FDAC7525B56a49Ef6',
  wavesContract: null,
  totalWaves: 0,
  waves: [],
  message: '',
  async init() {
    this.checkIfWalletIsConnected();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    this.wavesContract = new ethers.Contract(this.contractAddress, contractABI.abi, signer);
    this.totalWaves = await this.wavesContract.getTotalWaves();
    this.getAllWaves();
  },
  async checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        this.currentAccount = accounts[0];
        console.log("Found an authorized account:", this.currentAccount);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  },
  async connectWallet() {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      this.currentAccount = accounts[0]; 
    } catch (error) {
      console.log(error)
    }
  },
  async wave() {
    try {
      const { ethereum } = window;

      if (ethereum) {
        this.totalWaves = await this.wavesContract.getTotalWaves();
        console.log("Retrieved total wave count...", this.totalWaves.toNumber());
        const waveTxn = await this.wavesContract.wave(this.currentAccount, this.message);
        console.log("Mining...", waveTxn.hash);
        this.message = '';

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        this.totalWaves = await this.wavesContract.getTotalWaves();
        await this.getAllWaves();
        console.log("Retrieved total wave count...", this.totalWaves.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  },
  async getAllWaves() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const waves = await this.wavesContract.getAllWaves();

        waves.forEach(wave => {
          this.waves.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000).toLocaleString('en-US', { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
            message: wave.message
          });
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
}))

Alpine.start()
