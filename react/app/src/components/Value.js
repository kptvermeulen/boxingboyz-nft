import React, { useEffect, useState } from "react";
import BB2 from "./../assets/img/BoxingBoyzGif.gif";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Value({ aS, iA, tH, discordLink }) {
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
    <div className="fadeBackgroundSection" ref={ref}>
      <div
        className="center maxWidthContainer"
        style={{ flexDirection: "column", padding: "150px 100px" }}
        id="scrollValue"
      >
        <h3 className="coloredText">The value of Boxing Boyz</h3>
        <h1>WE ARE SPECIAL</h1>
        <div
          className="container "
          style={{ backgroundColor: "black", margin: "50px 0px" }}
        >
          <div className="column11 desktopHeight">
            <div
              className="VcenterFull reducePadding20"
              style={{ padding: "50px" }}
            >
              <h2 style={{ marginBottom: "20px" }}>PLAY TO EARN</h2>
              <p>
                By owning a Boxing Boy you will be able to fight other Boxing
                Boyz with your own character. Winning these fights will earn you
                $BOXING tokens. This play to earn mechanism will motivate people
                to be more engaged in the project and let them earn money by
                playing our game.
              </p>
              <a href={discordLink} target="_blank">
                <div
                  className="btn roundBtn btnWhite"
                  style={{
                    fontWeight: 600,
                    maxWidth: "150px",
                    marginTop: "40px",
                  }}
                >
                  Join Discord
                </div>
              </a>

              <h2 style={{ marginBottom: "20px", marginTop: "80px" }}>
                Attributes
              </h2>
              <p>
                The Boxing boyz are designed in 3D with more than 150 elements
                and are based on a unique concept that embodies the current NFT
                movement.
              </p>
            </div>
            <motion.div className="imageContainer" animate={animation}>
              <img src={BB2}></img>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
