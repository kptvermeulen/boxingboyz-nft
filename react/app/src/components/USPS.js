import React from "react";
import USP1 from "assets/img/USP1.png";
import USP2 from "assets/img/USP2.png";
import USP3 from "assets/img/USP3.png";

export default function USPS() {
  return (
    <div
      className="maxWidthContainer"
      style={{
        paddingTop: "0px",
        paddingBottom: "75px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        className="removeOnBigScreen"
        style={{ marginBottom: "40px", textAlign: "center" }}
      >
        GAME FEATURES
      </h2>
      <div className="container">
        <div className="column111" style={{ width: "100%" }}>
          <div
            className="flex flexColumnsUSPs"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <img
              alt="BBUSP"
              src={USP1}
              style={{ width: "70px", marginRight: "15px" }}
            />
            <h2 style={{ fontSize: "20px", lineHeight: "25px" }}>
              In-game currencies
            </h2>
          </div>
          <div
            className="flex flexColumnsUSPs"
            style={{ justifyContent: "center" }}
          >
            <img
              alt="BBUSP"
              src={USP2}
              style={{ width: "70px", marginRight: "15px" }}
            />
            <h2 style={{ fontSize: "20px", lineHeight: "25px" }}>
              Marketplace
            </h2>
          </div>
          <div
            className="flex flexColumnsUSPs"
            style={{ justifyContent: "center" }}
          >
            <img
              alt="BBUSP"
              src={USP3}
              style={{ width: "70px", marginRight: "15px" }}
            />
            <h2 style={{ fontSize: "20px", lineHeight: "25px" }}>Staking</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
