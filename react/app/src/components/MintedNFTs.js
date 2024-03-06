import React, { useEffect, useState } from "react";
import "styles/mintedNFTs.css";
import Metamask from "assets/img/metamask.svg";
import {
  isConnectedToBlockchain,
  initWeb3,
  connectToBlockchain,
  getBoxingBoyz,
} from "../libraries/Blockchain";

export default function MintedNFTs() {
  const [connected, setConnected] = useState(false);

  const componentDidMount = async () => {
    try {
      let result = await initWeb3();
      if (!result) {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask on a desktop or laptop!"
        );
        return;
      }

      await connectToBlockchain();
    } catch (err) {
      alert("Error: Please reload the page");
    }
  };
  async function connectMetamask() {
    await componentDidMount();
    if (isConnectedToBlockchain()) {
      setConnected(true);
      getBoxingBoyz();
    }
  }

  useEffect(() => {
    if (isConnectedToBlockchain()) {
      setConnected(true);
    }
  }, []);

  return (
    <div className="maxWidthContainer">
      {connected ? (
        <div className="container mNContainer center">
          <h2 style={{ marginBottom: "50px" }}>YOUR BOXINGBOYZ</h2>
          <div className="column111">
            <div className="noNFT">
              <div
                className="btn roundBtn btnWhite"
                onClick={() => {
                  document.getElementById("scrollTop").scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Get yours now
              </div>
            </div>
            <div className="noNFT">
              <div
                className="btn roundBtn btnWhite"
                onClick={() => {
                  document.getElementById("scrollTop").scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Get yours now
              </div>
            </div>
            <div className="noNFT">
              <div
                className="btn roundBtn btnWhite"
                onClick={() => {
                  document.getElementById("scrollTop").scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Get yours now
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="container mNContainer center"
          style={{ padding: "25px" }}
        >
          <div className="flex">
            <h2 style={{ fontSize: "28px", marginRight: "25px" }}>
              View your <span className="coloredText">BoxingBoyz</span>
            </h2>
            <div className="btn roundBtn btnWhite" onClick={connectMetamask}>
              <img
                src={Metamask}
                alt="Metamask"
                style={{ height: "25px", marginRight: "10px" }}
              />
              Connect
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
