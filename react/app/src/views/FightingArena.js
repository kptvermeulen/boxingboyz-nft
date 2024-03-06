import React from "react";
import Header from "components/Header";
import HorizontalBanner from "components/HorizontalBanner";
import { IoExit } from "react-icons/io5";
import { useHistory } from "react-router-dom";

export default function FightingArena({ dL }) {
  const history = useHistory();
  return (
    <>
      <Header discordLink={dL} />
      <div
        className="maxWidthContainer fightingArenaContainer"
        style={{
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1>Fighting Arena</h1>
        <h2 className="coloredText" style={{ width: "300px", height: "100px" }}>
          Coming Soon
        </h2>
        <HorizontalBanner padding={"0px"} button={false} />
        <div
          className="btn roundBtn HBButton"
          style={{ width: "150px", margin: "auto", marginTop: "50px" }}
          onClick={() => {
            history.push(
              "/?initial-scroll=fighting-arena&debugmode=DevMode3827"
            );
          }}
        >
          <IoExit className="HBButtonIcon" />
          Back
        </div>
      </div>
    </>
  );
}
