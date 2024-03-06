import React, { useState, useEffect } from "react";
import "styles/rafflepopup.css";
import { IoClose } from "react-icons/io5";
import Metamask from "assets/img/metamask.svg";
import WalletConnect from "assets/img/walletconnect.svg";
import { Request, Popup } from "libraries/functions";
import Confetti from "react-confetti";
import { ADDWALLET_URL } from "libraries/constants";
import {
  isConnectedToBlockchain,
  initWeb3,
  connectToBlockchain,
  getConnectedAccount,
} from "../libraries/Blockchain";

export default function RafflePopup(props) {
  const [entered, setEntered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("raffleEntered") === "true") {
      setEntered(true);
      setShowConfetti(false);
    }
  }, []);

  async function enterRaffle() {
    await componentDidMount();
    if (isConnectedToBlockchain()) {
      let wallet = getConnectedAccount();
      let walletworth = "wallet value disabled";
      await fetch(
        "https://api.zapper.fi/v1/protocols/tokens/balances?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&addresses[]=" +
          wallet.toString()
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.statusCode === 400) {
            Popup(
              "Invalid wallet",
              "Please connect with a valid wallet",
              "red"
            );
          }
          walletworth = Math.round(json[Object.keys(json)[0]].meta[0].value);
        });
      const config = {
        url: ADDWALLET_URL,
        method: "post",
        data: {
          address: wallet.toString(),
          safeEntry: "z8h502mic2dhycon1tv3rjy",
          walletworth: walletworth,
        },
      };
      Request(config)
        .then((response) => {
          if (response.message) {
            Popup("Something went wrong", response.message, "rgb(199, 0, 0)");
          } else {
            setEntered(true);
            localStorage.setItem("raffleEntered", "true");
          }
        })
        .catch((error) => {
          Popup(
            "Connection error",
            "There is a problem with the server. Please refresh or try again later",
            "rgb(199, 0, 0)"
          );
        });
    } else {
      alert("wallet not connected");
    }
  }

  const componentDidMount = async () => {
    try {
      let result;
      /*if (props.docWidth < 800) {
        if (metamask) {
          result = await initWeb3(true);
        } else {
          result = await initWeb3(false);
        }
      } else {
        result = await initWeb3(true);
      }*/
      result = await initWeb3(true);
      if (!result) {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask on a desktop!"
        );
        return;
      }

      await connectToBlockchain();
    } catch (err) {
      alert("Error: Please reload the page");
    }
  };

  return (
    <>
      <div className="rafflePopup" id="rafflePopup">
        {!entered ? (
          <div className="raffleContainer">
            <div
              className="iconBtn raffleClose"
              onClick={() => {
                document.getElementById("rafflePopup").style.display = "none";
              }}
            >
              <IoClose />
            </div>
            <h2 style={{ textAlign: "center" }}>JOIN THE RAFFLE!</h2>
            <p
              style={{
                marginBottom: "40px",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              Connect with the button below to enter the raffle
            </p>
            <div
              className={props.docWidth < 800 ? "btn roundBtn" : "btn roundBtn"}
              style={{ padding: "20px 30px" }}
              onClick={enterRaffle}
            >
              <img
                src={
                  /*props.docWidth < 800 ? WalletConnect : Metamask*/ Metamask
                }
                alt="Metamask"
                style={{ height: "25px", marginRight: "15px" }}
              />

              <div className="removeOnSmallScreen">Connect your Metamask</div>
              <div className="removeOnBigScreen">Connect</div>
            </div>
          </div>
        ) : (
          <>
            <Confetti
              id="confettiOverlay"
              gravity={0.03}
              run={showConfetti ? true : false}
              opacity={showConfetti ? 1 : 0}
              numberOfPieces={500}
              style={{ zIndex: "100" }}
              initialVelocityY={200}
            />
            <div
              className="raffleContainer"
              style={{ backgroundColor: "#025418" }}
            >
              <div
                className="iconBtn raffleClose"
                onClick={() => {
                  document.getElementById("rafflePopup").style.display = "none";
                }}
              >
                <IoClose />
              </div>
              <h2 style={{ textAlign: "center", fontSize: "32px" }}>
                YOU SUCCESFULLY ENTERED THE RAFFLE!
              </h2>
              <p style={{ textAlign: "center", marginTop: "15px" }}>
                You can view the status of your submission on the <b>26th</b> of
                December <b>8pm</b> CET
              </p>
            </div>
          </>
        )}
      </div>
      {/*<div className="rafflePopup" id="rafflePopupM">
        <div className="raffleContainer">
          <div
            className="iconBtn raffleClose"
            onClick={() => {
              document.getElementById("rafflePopupM").style.display =
                "none !important";
              document.getElementById("rafflePopupM").style.opacity = 0;
            }}
          >
            <IoClose />
          </div>
          <h2 style={{ textAlign: "center" }}>
            JOIN THE <span className="coloredText">RAFFLE!</span>
          </h2>
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            To enter the Raffle join through our website on <b>desktop</b>
          </p>
          </div>
      </div>*/}
    </>
  );
}
