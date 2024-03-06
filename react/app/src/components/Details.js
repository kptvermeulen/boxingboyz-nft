import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Details({ aS, iA, tH }) {
  const [ref, inView] = useInView({ threshold: tH });
  const animation1 = useAnimation();
  const animation2 = useAnimation();
  const animation3 = useAnimation();
  const animation4 = useAnimation();
  const animation5 = useAnimation();
  const animation6 = useAnimation();
  const [animated, setAnimated] = useState(false);

  const delayInterval = 0.2;

  useEffect(() => {
    if (!animated) {
      if (inView) {
        aS.transition.delay = 0;
        animation1.start(aS);
        aS.transition.delay = delayInterval * 1;
        animation2.start(aS);
        aS.transition.delay = delayInterval * 2;
        animation3.start(aS);
        aS.transition.delay = delayInterval * 3;
        animation4.start(aS);
        aS.transition.delay = delayInterval * 4;
        animation5.start(aS);
        aS.transition.delay = delayInterval * 5;
        animation6.start(aS);
        setAnimated(true);
      } else {
        animation1.start(iA);
        animation2.start(iA);
        animation3.start(iA);
        animation4.start(iA);
        animation5.start(iA);
        animation6.start(iA);
      }
    }
  }, [inView]);

  return (
    <div
      className="maxWidthContainer"
      style={{ padding: "50px 0px" }}
      id="scrollDetails"
      ref={ref}
    >
      <h3 className="coloredText">Details about</h3>
      <h1 style={{ marginBottom: "40px" }}>THE PROJECT</h1>
      <div className="column111" style={{ gap: "25px" }}>
        <motion.div
          animate={animation1}
          className="container containerHighlight"
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Unique</h2>
          <p>
            The Boxing boyz is an one of a kind project that connects the real
            life boxing world with the digital NFT space. With our project we
            are going to make sure that every holder will not regret buying our
            NFT
          </p>
        </motion.div>
        <motion.div
          animate={animation2}
          className="container containerHighlight"
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Community</h2>
          <p>
            Our project is completely community driven, we are going to make
            sure that our community will be one of the communities to spend time
            in. We will make this happen by getting the community engaged within
            everything we do and creating community driven events like
            tournaments.
          </p>
        </motion.div>
        <motion.div
          animate={animation3}
          className="container containerHighlight"
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Collection</h2>
          <p>
            The Boxing Boyz will be a collection of 10.000 characters. These
            will be all unique characters with their own special traits.
          </p>
        </motion.div>
      </div>
      <div className="column111" style={{ gap: "25px", marginTop: "25px" }}>
        <motion.div
          animate={animation4}
          className="container containerHighlight"
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Utilities</h2>
          <p>
            With the Boxing Boyz you will gain access to many amazing utilities.
            These utilities include being able to participate in fights
            (tournaments and 1-vs-1) with your own Boxing Boyz, giveaways, meet
            and greets with your favorite boxers and much more.
          </p>
        </motion.div>
        <motion.div
          animate={animation5}
          className="container containerHighlight"
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Team</h2>
          <p>
            Our team, with the best people in the industry, is working day and
            night to make sure this project succeeds. We will be here to answer
            any questions and listen to the things our community wants.
          </p>
        </motion.div>
        <motion.div
          animate={animation6}
          className="container containerHighlight"
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
            Tokenstructure
          </h2>
          <p>
            With our own token we are able to create real benefits and
            advantages for people that are holding our NFT. Through staking your
            Boxing Boyz you will be able to earn our tokens that you can use for
            many different things like getting access to our second generation,
            participating in the fights, buying merch and tickets for real
            fights.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
