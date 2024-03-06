import React from "react";
import "styles/faq.css";

const content = [
  {
    title: "What are the Boxing Boyz?",
    content:
      "The Boxing Boyz are a 3D animated NFT collection of 10,000 uniquely generated boxing characters. This project is created with a vision to combine the real boxing world with the digital revolution through a play-to-earn game.~n~nThis project was created by a team that has deep roots in the boxing industry. By working closely with boxers and other people from this industry, a project has been created that is made by and for boxers and boxing fans.",
  },
  {
    title: "What are the Utilities of The Boxing Boyz?",
    content:
      "The utilities involved in the development of this project are:~n- A Token~n- A play to earn game~n- Amazing artworks~n- Boxing related giveaways and prices~n- VR game",
  },
  {
    title: "When is the Official Launch Date?",
    content:
      "BoxingBoyz is launching on boxing day, the 26th of december. The launch will take place at 8pm CET.",
  },
  {
    title: "Where will the Minting take place?",
    content:
      "As regards the minting of our NFT tokens, you will be able to mint the NFT’s on this website using the Ethereum network.",
  },
  {
    title: "Is there a whitelist?",
    content:
      "Yes. We have a whitelist where anyone interested to be whitelisted will be given the opportunity to do so after meeting some of the criteria. We will organize community-driven challenges and giveaways to ensure that everyone that contributes to the project has a chance to win a whitelist spot.",
  },
  {
    title: "Is there a maximum mints per wallet?",
    content: "You will be able to mint a maximum of 3 Boxing Boyz per wallet.",
  },
];

export default function FAQ() {
  return (
    <div
      className="maxWidthContainer"
      id="scrollFAQ"
      style={{ padding: "50px 25px", paddingBottom: "0px" }}
    >
      <h3 className="coloredText">Still have questions?</h3>
      <h1 style={{ marginBottom: "40px" }}>FAQ</h1>
      {content.map((indContent, index) => {
        return (
          <div
            className="container containerHighlight FAQContainer"
            id={"FAQContainer" + index}
            style={{ cursor: "pointer" }}
            onClick={() => {
              document
                .getElementById("FAQContainer" + index)
                .classList.toggle("expanded");
              document
                .getElementById("FAQArrow" + index)
                .classList.toggle("expanded");
            }}
          >
            <div
              className="flex FAQContent"
              style={{ justifyContent: "space-between", paddingBottom: "20px" }}
            >
              <h2 className="FAQTitle">{indContent.title}</h2>
              <div id={"FAQArrow" + index} className="FAQArrow">
                <svg viewBox="0 0 448 512" style={{ width: "25px" }}>
                  <path
                    fill="white"
                    d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                    class=""
                  ></path>
                </svg>
              </div>
            </div>
            <p>
              {indContent.content.split("~n").map((paragraph) => {
                return (
                  <>
                    {paragraph} <br />
                  </>
                );
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
