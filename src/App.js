/**
 * JSX part :
 *  Connect Wallet button
 *  Dont enable any other elements until connect wallet button is shown
 *  After the wallet is connected, then show the rest of the elements except Sign Button
 *  Show Sign button only after proposalID, Vote and the network is selected
 *
 * Functionality part I need to work on :
 *  I need to implement useEffect for chain changing
 */

import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import { getMainContract, getRouterContract } from "./utils/contracts";

function App() {
  const [wallet, setWallet] = useState(null);  // get wallet interface
  const [provider, setProvider] = useState(null); // get the provider for signer
  const [contract, setContract] = useState('sepolia');  // setting contract instance based on network
  const [proposalId, setProposalId] = useState(null); // setting proposal ID for voting
  const [vote, setVote] = useState(0); // Voting for or against; 0: for, 1: against

  /**
   * Function to connect the wallet
   * When the wallet is connected, the wallet address is set to the state along with provider
   */
  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get metamask!");
    }
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        // console.log(window.ethereum);
        setWallet(accounts[0]);
        // console.log(accounts[0]);
        setProvider(new ethers.BrowserProvider(window.ethereum));
        console.log(provider);
        // console.log(await getSigner());
      });
  };

  /**
   *
   * @returns signer
   * Returns the signer for the provider which will be used to call the metamask to sign transactions
   */

  const getSigner = async () => {
    const signer = await provider.getSigner();
    // console.log(signer);
    return signer;
  };

  /**
   * Function to select the contract based on network and call the voting function based on the contract
   */

  const contractSelection = async () => {
    if (contract === "sepolia") {
      const contract = await getMainContract(await getSigner());
      const tx = contract.voteProposal(proposalId, vote);
      tx.then((res) => console.log(res));
    } else if (contract === "mumbai") {
      const contract = await getRouterContract(await getSigner());
      const tx = contract.sendVote(proposalId, vote);
      tx.then((res) => console.log(res));
    }
  };

  /**
   * Function to handle the change in the select element for network which will later be used to select the contract
   */

  const handleSelect = (e) => {
    console.log(e.target.value);
    setContract(e.target.value);
  };

  /**
   * Function to handle the change in the select element for voting, which will later be used to vote for or against
   */
  const handleVote = (e) => {
    console.log(e.target.value);
    setVote(e.target.value);
  };

  /**
   * To do By Me:
   * 1. Implement useEffect for chain changing
   *
   */

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>{wallet}</p>
      <select onChange={handleSelect} >
        <option value="sepolia">Sepolia</option>
        <option value="mumbai">Mumbai</option>
      </select>
      <input
        onChange={(e) => setProposalId(e.target.value)}
        placeholder="Proposal ID"
      />

      <select onChange={handleVote} value={vote}>
        <option value="0">FOR</option>
        <option value="1">AGAINST</option>
      </select>
      <button onClick={contractSelection}>Sign</button>
      <p>{proposalId}</p>
      <p>{vote}</p>
      <p>{contract}</p>
    </div>
  );
}

export default App;
