import React, { useEffect, useState } from "react";
import colors from "assets/img/colors.png";
import Confetti from "react-confetti";
import {
  claimBoxingBoy,
  isWhitelisted,
  connectToBlockchain,
  isConnectedToBlockchain,
  initWeb3,
  isWeb3Ready,
  getMintValue,
  getConnectedAccount,
  getBalance,
  getEtherBalance,
  getMintETHValue,
  loadCount,
} from "../libraries/Blockchain";
import { ADDWALLET_URL } from "libraries/constants";
import { Popup, Request } from "libraries/functions";
import CountDown from "components/Countdown";
import ring from "./../assets/img/ring.png";
import Header from "./../assets/img/boxignBackground.png";
import Video from "./../assets/video/mintVideoDesktop.mp4";
import VideoPhone from "./../assets/video/mintVideoPhone.mp4";
import { IoMdClose } from "react-icons/io";
import Metamask from "assets/img/metamask.svg";
import CountUp from "react-countup";

export default function HeaderFV({ discordLink, docWidth }) {
  const [confettiRun, setConfettiRun] = useState(false);
  const [minting, setMinting] = useState(false);
  const [count, setCount] = useState(1);
  const [connected, setConnected] = useState(false);
  const [NFTsLeft, setNFTsLeft] = useState(1);
  const [entered, setEntered] = useState(false);
  const [maxMint, setMaxMint] = useState(3);

  const [future, setFuture] = useState(
    new Date("December 26, 2021 14:00:00 GMT+01:00")
  );
  const [countdownCompleted, setCountdownCompleted] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);

  function onError(error) {
    if (error.code !== 4001) {
      Popup(
        "Error",
        "An error with MetaMask occured. Please try again later.",
        "red"
      );
      console.log(error);
    }
    setMinting(false);
  }
  function onDone() {
    document
      .getElementById("popup")
      .parentNode.removeChild(document.getElementById("popup"));
    /*document.getElementById("confettiOverlay").style.display = "block";
    Popup(
      "Congratulations!",
      "You succesfully acquired one of the Boxing Boyz! View your mints on ~Opensea~",
      "green",
      "https://testnets.opensea.io/account?search[sortBy]=LAST_TRANSFER_DATE&search[query]=Boxing%20Boyz"
    );*/
    /*CHANGE*/
    setConfettiRun(true);
    /*setTimeout(function () {
      document.getElementById("confettiOverlay").classList.add("fadeOut");
    }, 7000);
    setTimeout(function () {
      document.getElementById("confettiOverlay").style.display = "none";
      document.getElementById("confettiOverlay").classList.remove("fadeOut");
    }, 9000);*/
    setMinting(false);
  }

  const componentDidMount = async () => {
    try {
      let result = await initWeb3();
      if (!result) {
        window.alert(
          "Connecting is only possible on desktop or with a metamask browser on mobile."
        );
        return;
      }

      await connectToBlockchain();
    } catch (err) {
      alert("Error: Please reload the page");
    }
  };

  async function getNFTCount() {
    setNFTsLeft(5000 - (await loadCount()));
  }

  function ConnectButton() {
    return (
      <div
        className="mintButton center"
        style={{ flexDirection: "column" }}
        onClick={async () => {
          await componentDidMount();

          if (isConnectedToBlockchain()) {
            await getNFTCount();
            setInterval(async function () {
              await getNFTCount();
            }, 5000);
            setConnected(true);

            let balance = await getBalance();
            if (balance > 2) {
              setCount(0);
            }
            setMaxMint(3 - balance);
          }
        }}
      >
        <h1 className="disableSelect" style={{ fontSize: "40px" }}>
          Connect
        </h1>
      </div>
    );
  }

  async function enterRaffle() {
    if (isConnectedToBlockchain()) {
      let wallet = getConnectedAccount();
      let balance = await getEtherBalance();
      let mintValue = await getMintETHValue(1);
      const config = {
        url: ADDWALLET_URL,
        method: "post",
        data: {
          address: wallet.toString(),
          safeEntry: "z8h502mic2dhycon1tv3rjy",
          walletworth: balance,
        },
      };
      if (balance > mintValue) {
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
        /*Popup(
          "Insufficient Wallet Balance",
          "Your wallet has insufficient ETH to enter the raffle. Please connect with another wallet address or add at least 0.2 ETH + gasfees to your current wallet to join the raffle",
          "#bd1515"
        );*/
        document.getElementById("insufficientBalanceContainer").style.display =
          "flex";
      }
    } else {
      alert("wallet not connected");
    }
  }

  function RaffleButton() {
    return (
      <div className="center" style={{ flexDirection: "column" }}>
        <h2 style={{ textAlign: "center" }}>Join the Raffle Whitelist!</h2>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          You can join the Raffle Whitelist to get a chance to mint your
          BoxingBoyz with the button below
        </p>

        <div
          className="btn roundBtn"
          style={{ marginTop: "40px", padding: "20px 40px" }}
          onClick={enterRaffle}
        >
          <img
            src={Metamask}
            alt="Metamask"
            style={{ height: "25px", marginRight: "15px" }}
          />
          Join the Raffle
        </div>
        <div
          className="container"
          id="insufficientBalanceContainer"
          style={{
            maxWidth: "470px",
            marginTop: "30px",
            padding: "25px 20px",
            borderRadius: "15px",

            border: "1px solid #520205",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              textAlign: "center",
              lineHeight: "22px",
              marginBottom: "5px",
            }}
          >
            Insufficient Wallet Balance
          </h2>
          <p style={{ textAlign: "center", fontSize: "16px" }}>
            Your wallet has insufficient ETH to enter the raffle. Please connect
            with another wallet address or add at least 0.2 ETH + gasfees to
            your current wallet to join the raffle
          </p>
        </div>
      </div>
    );
  }

  function MintButton() {
    return (
      <div className="center" style={{ flexDirection: "column" }}>
        <div
          className="mintButton center"
          onClick={async () => {
            if (count > 0) {
              //CHANGE
              if (NFTsLeft > 0) {
                await componentDidMount();
                if (isConnectedToBlockchain()) {
                  let value = await getMintValue(count);
                  let ethValue = await getMintETHValue(count);
                  let balance = await getEtherBalance();
                  if (balance > ethValue) {
                    setMinting(true);
                    claimBoxingBoy(count, value)
                      .on("error", async (error, receipt) => {
                        console.log("error");
                        await onError(error);
                      })
                      .on("transactionHash", async () => {
                        Popup(
                          "Minting...",
                          "Please wait while we get your BoxingBoy ready.",
                          "#1d66db"
                        );
                      })
                      .on("changed", async () => {
                        Popup(
                          "Minting...",
                          "Please wait while we get your BoxingBoy ready.",
                          "#1d66db"
                        );
                      })
                      .on("receipt", async () => {
                        await onDone();
                      });
                  } else {
                    /*alert(
                    "Not enough ETH balance to complete this transaction. Please add at least " +
                      Math.round(0.2 * count * 100) / 100 +
                      " ETH + gasfees."
                  );*/
                    document.getElementById(
                      "insufficientBalanceContainer"
                    ).style.display = "flex";
                  }
                } else {
                  alert("wallet not connected");
                }
              } else {
                alert("The sale has ended. All BoxingBoyz are sold!");
              }
            } else {
              alert("You can't have more than three BoxingBoyz on your wallet");
            }
          }}
        >
          <h1 className="disableSelect" style={{ fontSize: "45px" }}>
            {!minting ? (
              "Mint"
            ) : (
              <div
                className=""
                style={{
                  width: "100%",
                  height: "100%",
                  marginLeft: "-38px",
                  marginTop: "-92px",
                }}
              >
                <div
                  className="loading"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: "scale(1)",
                  }}
                >
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
          </h1>
        </div>
        <div
          className="flex disableSelect"
          style={{ marginTop: "20px", zIndex: "5" }}
        >
          <div
            className="btn roundBtn"
            style={{ padding: "12px 20px" }}
            onClick={() => {
              if (count > 1) {
                setCount(count - 1);
              }
            }}
          >
            -
          </div>
          <div className="input" style={{ margin: "5px 20px" }}>
            <h1>{count}</h1>
          </div>
          <div
            className="btn roundBtn"
            style={{ padding: "12px 18px" }}
            onClick={() => {
              if (count < maxMint) {
                setCount(count + 1);
              }
            }}
          >
            +
          </div>
        </div>
        {NFTsLeft > 0 ? (
          <div
            className="container center"
            style={{
              flexDirection: "row",
              width: "160px",
              borderRadius: "15px",
              marginTop: "25px",
              padding: "15px",
              border:
                NFTsLeft < 500
                  ? NFTsLeft < 150
                    ? "1px solid #a10a0a"
                    : "1px solid #a1500a"
                  : "1px solid #79b098",
            }}
          >
            <h2 style={{ fontSize: "24px", lineHeight: "20px" }}>
              <CountUp
                end={NFTsLeft}
                duration={5}
                useEasing={true}
                preserveValue={true}
              />
            </h2>
            <h2
              className="coloredText"
              style={{
                fontSize: "20px",
                lineHeight: "20px",
                marginLeft: "5px",
              }}
            >
              Left
            </h2>
          </div>
        ) : (
          <div className=""></div>
        )}
        <div
          className="container"
          id="insufficientBalanceContainer"
          style={{
            maxWidth: "470px",
            marginTop: "30px",
            padding: "25px 20px",
            borderRadius: "15px",
            border: "1px solid rgb(116 10 23)",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              textAlign: "center",
              lineHeight: "22px",
              marginBottom: "5px",
            }}
          >
            Insufficient Wallet Balance
          </h2>
          <p style={{ textAlign: "center", fontSize: "16px" }}>
            Your wallet has insufficient ETH to enter the raffle. Please connect
            with another wallet address or add at least{" "}
            {Math.round(0.25 * count * 100) / 100} ETH + gasfees to your current
            wallet to mint your BoxingBoyz
          </p>
        </div>
      </div>
    );
  }

  function onCountdownComplete() {
    setCountdownCompleted(true);
  }

  function MintedVideo() {
    return (
      <div className="mintCVideoContainer">
        <h1 style={{ zIndex: 970 }}>Congratulations!</h1>
        <p style={{ marginBottom: "50px", textAlign: "center" }}>
          You succesfully acquired one of the Boxing Boyz!
        </p>
        {docWidth < 800 ? (
          <video controls autoPlay className="mintCVideo">
            <source src={VideoPhone} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <video controls autoPlay className="mintCVideo">
            <source src={Video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="flex">
          <div
            className="btn mintVideoCloseBtn"
            onClick={() => {
              setConfettiRun(false);
            }}
          >
            <IoMdClose style={{ marginRight: "10px" }} />
            Close
          </div>
          <a
            href="https://opensea.io/account?search[sortBy]=LAST_TRANSFER_DATE&search[query]=Boxing%20Boyz"
            target="_blank"
            rel="noreferrer"
            style={{ zIndex: 970 }}
          >
            <div
              className="btn roundBtn"
              style={{
                background: "#2081E2",

                marginLeft: "10px",
              }}
            >
              <svg viewBox="0 0 90 90" style={{ height: "40px" }}>
                <path
                  d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z"
                  fill="#2081E2"
                />
                <path
                  d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                  fill="white"
                />
                <path
                  d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z"
                  fill="white"
                />
              </svg>
              <div
                className="removeOnSmallScreen"
                style={{ margin: "0px 10px" }}
              >
                View Yours On Opensea
              </div>
            </div>
          </a>
        </div>
        <div className="confettiContainer">
          <Confetti
            id="confettiOverlay"
            gravity={0.03}
            run={confettiRun ? true : false}
            opacity={confettiRun ? 1 : 0}
            numberOfPieces={500}
            style={{ zIndex: "100" }}
            initialVelocityY={200}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="desktopRelative">
      {confettiRun ? <MintedVideo /> : ""}

      {!countdownCompleted ? (
        <div className="centerImage removeOnSmallScreen">
          <img src={Header} alt="boxing-ring" id="boxingRing" />
        </div>
      ) : (
        <div
          className="centerImage removeOnSmallScreen"
          style={{ height: "unset", opacity: 0.7 }}
        >
          <img
            src={ring}
            alt="boxing-ring"
            id="boxingRing"
            style={{ width: "100%", height: "auto", marginBottom: "-70px" }}
          />
        </div>
      )}

      <div
        className="centerImage removeOnBigScreen"
        style={{ maxWidth: "calc(100vw - 10px)" }}
      >
        <img src={ring} alt="boxing-ring" id="boxingRing" />
      </div>
      <div
        className="maxWidthContainer HeaderWImage"
        style={
          !countdownCompleted
            ? { marginTop: "0px" }
            : { marginTop: "0px", height: "1000px" }
        }
      >
        <div
          className="column11"
          style={
            !countdownCompleted
              ? { height: "100%" }
              : { height: "100%", marginTop: "-50px" }
          }
          id="scrollTop"
        >
          <div
            className={"Vcenter"}
            style={{
              flexDirection: "column",
              padding: "25px",
              position: "relative",
            }}
          >
            <h1 style={{ fontSize: "72px" }}>
              JOIN THE <br />
              <span className="coloredText highlightedText">BOXING BOYZ</span>
              <br /> TODAY
            </h1>
            <h4
              className="mobileCenterText removeOnSmallScreen"
              style={{
                marginTop: "70px",
                maxWidth: "450px",
                textShadow: "2px 2px 2px rgba(0, 0, 0, 0.7)",
              }}
            >
              The Boxing Boyz is a 3D animated NFT collection of 5,000 unique
              Boxing characters with 150 different elements. We combine the real
              boxing world with the digital revolution through a play to earn
              game.
            </h4>
            <div className="flex openseaButtonHeader">
              {/*<a
                href="https://opensea.io/collection/boxingboyz-metaverse"
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className="btn roundBtn"
                  style={{ padding: "10px 20px", background: "#2382e2" }}
                >
                  <svg
                    viewBox="0 0 90 90"
                    style={{ height: "40px", marginRight: "5px" }}
                  >
                    <path
                      d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z"
                      fill="#2081E2"
                    />
                    <path
                      d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                      fill="white"
                    />
                    <path
                      d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z"
                      fill="white"
                    />
                  </svg>
                  View on Opensea
                </div>
              </a>*/}
            </div>
            {!countdownCompleted ? (
              <CountDown
                future={future}
                onComplete={onCountdownComplete}
                discordLink={discordLink}
              />
            ) : (
              ""
            )}
          </div>
          {countdownCompleted ? (
            <div className="center mobileWhitelist">
              {connected ? (
                /*whitelisted ? (*/
                //CHANGE
                NFTsLeft > 0 ? (
                  <MintButton />
                ) : (
                  <div className="center">
                    <div
                      className="container"
                      style={{
                        maxWidth: "470px",
                        marginTop: "30px",
                        padding: "40px",
                        borderRadius: "15px",

                        border: "1px solid #056109",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: "30px",
                          textAlign: "center",
                          lineHeight: "34px",
                          marginBottom: "5px",
                        }}
                      >
                        Sale has ended!
                      </h2>
                      <p style={{ textAlign: "center", fontSize: "16px" }}>
                        View your minted BoxingBoyz on Opensea:
                      </p>
                      <a
                        href="https://opensea.io/collection/boxingboyz-metaverse"
                        target="_blank"
                        rel="noreferrer"
                        style={{ zIndex: 970 }}
                      >
                        <div
                          className="btn roundBtn"
                          style={{
                            background: "#2081E2",
                            marginTop: "20px",
                            marginLeft: "10px",
                          }}
                        >
                          <svg viewBox="0 0 90 90" style={{ height: "40px" }}>
                            <path
                              d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z"
                              fill="#2081E2"
                            />
                            <path
                              d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                              fill="white"
                            />
                            <path
                              d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z"
                              fill="white"
                            />
                          </svg>
                          <div
                            className="removeOnSmallScreen"
                            style={{ margin: "0px 10px" }}
                          >
                            View On Opensea
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                )
              ) : (
                /*}) : entered ? (
                  <div className="center">
                    <div
                      className="container"
                      style={{
                        maxWidth: "470px",
                        marginTop: "30px",
                        padding: "30px",
                        borderRadius: "15px",

                        border: "1px solid #056109",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: "18px",
                          textAlign: "center",
                          lineHeight: "22px",
                          marginBottom: "5px",
                        }}
                      >
                        Congratulations! You've won for the Raffle!
                      </h2>
                      <p style={{ textAlign: "center", fontSize: "16px" }}>
                        Please wait while we verify your wallet on the
                        blockchain. Refresh this page in{" "}
                        <strong> 10 minutes </strong> to mint your own
                        BoxingBoyz!
                      </p>
                    </div>
                  </div>
                ) : (
                  <RaffleButton />
                )
              ) : (*/
                <ConnectButton />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
