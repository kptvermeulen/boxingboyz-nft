import React, { useEffect } from "react";
import Header from "components/Header";
import HeaderFV from "components/HeaderFV";
import About from "components/About";
import CTA from "components/CTA";
import Partners from "components/Partners";
import GameModes from "components/GameModes";
import FAQ from "components/FAQ";
import HorizontalBanner from "components/HorizontalBanner";
import USPS from "components/USPS";
import TimelineRoadmap from "components/TimelineRoadmap";
import Team from "components/Team";
import ImageHighlight from "components/ImageHighlight";
import WalletConnectPopup from "components/WalletConnectPopup";

export default function Home({ dL }) {
  const urlParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    document.body.classList.add("scrollbar");
    if (urlParams.get("initial-scroll") !== null) {
      document.getElementById("scrollHorizontalBanner").scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  const aS = {
    transform: "scale(1)",
    opacity: 1,
    transition: { type: "spring", duration: 1, bounce: 0.3, delay: 0 },
  };
  const iA = { transform: "scale(0.5)", opacity: 0 };

  var body = document.body,
    html = document.documentElement;

  var height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  const tH = Math.round(0.1 * (height / 2.5)) / 100;

  var docWidth = document.documentElement.offsetWidth;

  [].forEach.call(document.querySelectorAll("*"), function (el) {
    if (el.offsetWidth > docWidth) {
      console.log(el);
    }
  });

  return (
    <>
      <Header discordLink={dL} />

      <HeaderFV discordLink={dL} docWidth={docWidth} />

      {/*<RafflePopup docWidth={docWidth} />

      <MintedNFTs />*/}

      <WalletConnectPopup />

      <About aS={aS} iA={iA} tH={tH} discordLink={dL} />

      <GameModes aS={aS} iA={iA} tH={tH} />
      <HorizontalBanner aS={aS} iA={iA} tH={tH} />

      <USPS />

      <TimelineRoadmap aS={aS} iA={iA} tH={tH} />
      <ImageHighlight aS={aS} iA={iA} tH={tH} discordLink={dL} />
      <Partners aS={aS} iA={iA} tH={tH} />
      <Team />
      <FAQ />

      <CTA discordLink={dL} />
    </>
  );
}
