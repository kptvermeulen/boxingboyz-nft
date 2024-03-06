import React, { useEffect, useState } from "react";
import BB1 from "./../assets/img/BB1.png";
import BB2 from "./../assets/img/BoxingBoyzGif.gif";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function About({ aS, iA, tH, discordLink }) {
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
      <div
        className="column12"
        style={{ padding: "100px 0px", paddingBottom: "0px" }}
        id="scrollAbout"
      >
        <div className="flexContainer order2">
          <h3 className="coloredText">About Boxing Boyz</h3>
          <h1
            style={{
              marginTop: "10px",
              marginBottom: "20px",
              lineHeight: "50px",
            }}
          >
            PLAY TO EARN
          </h1>
          <p>
            Your Boxing Boy will be your playable character in the game. Each
            Boxing Boy has its own skillsets. You will be able to improve your
            skills and earn $BOXING by training, fighting and participating in
            tournaments. This play to earn mechanism will motivate you to be
            more engaged and let you earn money by playing the game. Become the
            Metaverse World Champion!
          </p>
          <a href={discordLink} rel="noreferrer" target="_blank">
            <div
              style={{ width: "150px", marginTop: "40px" }}
              className="btn roundBtn"
            >
              Join Now
            </div>
          </a>
        </div>
        <motion.div
          className="center order1 nftImage"
          animate={animation}
          style={{ padding: "30px 5px" }}
        >
          <img
            className="NFTImageImg"
            style={{ width: "100%", borderRadius: "25px" }}
            src={BB2}
          ></img>
        </motion.div>
      </div>
    </div>
  );
}
