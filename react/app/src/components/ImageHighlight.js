import React, { useEffect, useState } from "react";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TournamentImage from "assets/img/Illustrations/round.png";

export default function ImageHighlight({ aS, iA, tH, discordLink }) {
  const [ref, inView] = useInView({ threshold: tH });
  const animation = useAnimation();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!animated) {
      if (inView) {
        animation.start(aS);
        setAnimated(true);
      } else {
        animation.start(iA);
      }
    }
  }, [inView]);
  return (
    <div className="maxWidthContainer" ref={ref}>
      {/*<h3 className="coloredText center" style={{ marginBottom: "10px" }}>
        Knock them out
      </h3>*/}
      <h1
        style={{
          marginTop: "10px",
          marginBottom: "40px",
          lineHeight: "50px",
          textAlign: "center",
          fontSize: "48px",
        }}
        className="center"
      >
        <div style={{ display: "inline" }}>
          BECOME THE
          <span
            className="coloredText highlightedText metaverseHighlight"
            style={{ margin: "0px 10px" }}
          >
            METAVERSE
          </span>
          CHAMPION!
        </div>
      </h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={TournamentImage}
          alt="TournamentImage"
          style={{ maxWidth: "750px", width: "100%" }}
        />
      </div>
    </div>
  );
}
