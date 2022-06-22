import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './utils/MyEpicNFT.json';

const TWITTER_HANDLE = 'upnerscom';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  // if upload file
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "0x5509376a992cc7adB7E89a18D43D2a64970db0C0";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
 

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  // post file to 
const postFile= ()=>{
  setLoading(true);
  useEffect(()=>{
    fetch(OPENSEA_LINK, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         file: file
       })
     }).then(res => res.json())
     .then(data => 
        {
          setLoading(false);
          setSuccess(true);
          setError(data.error);
        }
      ) // Successful upload use success state to show success message
     .catch(err => console.log(err)) // Error
   }
   ,[])
 
  console.log(file)
}
console.log(loading)

const UploadIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 17v-6l-2 2M9 11l2 2" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  )
}
  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">UPNERS NFT Collection</p>
          <p className="sub-text">
            We are a creative project development studio focused on blockchain technology!
          </p>
          {success?
          <div>
            <p className="sub-text">Success!</p>
          </div>
          :(currentAccount === "" ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
          </button>
          ) : (
            <div className="upload-area">
              <div class="upload-btn-wrapper">
  <button class="input-btn cta-button connect-wallet-button">
    {file ? file.name : <span className="upload-button"><p>Upload</p><UploadIcon/></span>}
  </button>
  <input className="upload-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
</div>
            <button onClick={postFile} className={`cta-button ${file&&"connect-wallet-button"}`} disabled={loading||!file}
            >
              Mint NFT
            </button>
            </div> 
          ))}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;