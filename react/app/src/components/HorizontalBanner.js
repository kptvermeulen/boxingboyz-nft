import React from "react";
import VSBanner from "assets/img/VSPlatformSmall.jpg";
import "styles/horizontalBanner.css";
import { IoEnter } from "react-icons/io5";

export default function GameModes({ padding = "100px 50px", button = true }) {
  return (
    <div
      className="center maxWidthContainer horizontalBannerContainer"
      style={{ flexDirection: "column", padding: padding }}
      id="scrollHorizontalBanner"
    >
      {button ? (
        <>
          <h3 class="coloredText" style={{ marginTop: "25px" }}>
            Coming Soon
          </h3>
          <h1 style={{ marginBottom: "35px" }}>FIGHTING ARENA</h1>
        </>
      ) : (
        ""
      )}
      <div className="horizontalBannerImageContainer">
        <img src={VSBanner} alt="BoxingBoyzBanner" />
        {false ? (
          <div className="HBButtonContainer">
            <div className="btn roundBtn HBButton btnDisabled">
              <IoEnter className="HBButtonIcon" />
              Join Arena
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
