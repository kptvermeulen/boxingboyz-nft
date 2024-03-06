import React from "react";

export default function CTA({ discordLink }) {
  return (
    <div
      className="maxWidthContainer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "150px 0px",
      }}
    >
      <h2 className="centerH2" style={{ marginBottom: "60px" }}>
        WHAT ARE YOU WAITING FOR?
      </h2>
      <div className="flex CTAFlex">
        <a className="order2" href={discordLink} target="_blank">
          <div
            className="btn roundBtn"
            id="centerA"
            style={{ fontSize: "20px", marginRight: "30px", marginTop: "5px" }}
          >
            Join Discord
          </div>
        </a>
        <a
          className="order1"
          href="https://opensea.io/collection/boxingboyz-metaverse?search[sortAscending]=false&search[sortBy]=LAST_SALE_PRICE"
          target="_blank"
        >
          <div
            className="btn-underline roundBtn"
            style={{ fontSize: "20px", marginRight: "30px", marginTop: "5px" }}
          >
            Opensea
          </div>
        </a>
        {/*<div
          className="btn roundBtn order1"
          onClick={() => {
            document.getElementById("scrollTop").scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          Mint yours now
        </div>*/}
      </div>
    </div>
  );
}
