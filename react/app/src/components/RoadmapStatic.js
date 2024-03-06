import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "styles/static-roadmap.css";

export default function Details({ aS, iA, tH }) {
  const [ref, inView] = useInView({ threshold: tH });
  const [animated, setAnimated] = useState(false);
  const content = [
    {
      index: "0",
      title: "Pre Fight",
      content: "- Game development~n- Seed round",
    },
    {
      index: "1-4",
      title: "Round 1-4",
      content:
        "1. Build a Community~n2. Pre sale~n3. NFT Launch~n4. Reveal huge partnership",
    },
    {
      index: "5-8",
      title: "Round 5-8",
      content: "5. IDO~n6. Token launch~n7. DEX~n8. Staking",
    },
    {
      index: "9-11",
      title: "Round 9-11",
      content: "9. Marketplace~n10. Battle arena~n11. Tournaments",
    },
    {
      index: "12",
      title: "Round 12",
      content: "12. Full game launch",
    },
  ];
  const animations = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ];

  const delayInterval = 0.2;

  useEffect(() => {
    if (!animated) {
      if (inView) {
        for (let i = 0; i < animations.length; i++) {
          aS.transition.delay = delayInterval * i;
          animations[i].start(aS);
        }
        setAnimated(true);
      } else {
        for (let i = 0; i < animations.length; i++) {
          animations[i].start(iA);
        }
      }
    }
  }, [inView]);

  return (
    <div
      className="maxWidthContainer"
      style={{ padding: "50px 25px", position: "relative", maxWidth: "1100px" }}
      id="scrollDetails"
      ref={ref}
    >
      <h3 className="coloredText">Ding ding ding!</h3>
      <h1 style={{ marginBottom: "40px" }}>ROUNDMAP</h1>
      <div className="rmsTimeline"></div>
      <div style={{ marginTop: "80px", maxWidth: "300px" }}>
        {content.map((indContent, index) => {
          return (
            <motion.div animate={animations[index]} className="rmsTPoint">
              <div className="rmsTPMark">
                <div className="rmsTPMDot"></div>
                <h2 className="rmsTPMNumber">0{index + 1}</h2>
              </div>
              <div className="rmsTContent">
                <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                  {indContent.title}
                </h2>
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
