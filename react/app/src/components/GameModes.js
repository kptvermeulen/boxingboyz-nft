import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import BattleArena from "assets/img/Illustrations/BattleArena.png";
import Tournaments from "assets/img/Illustrations/Tournaments.png";
import Training from "assets/img/Illustrations/Training.png";
import "styles/gamemodes.css";

export default function GameModes({ aS, iA, tH }) {
  const [ref, inView] = useInView({ threshold: tH });
  const animation1 = useAnimation();
  const animation2 = useAnimation();
  const animation3 = useAnimation();
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
        setAnimated(true);
      } else {
        animation1.start(iA);
        animation2.start(iA);
        animation3.start(iA);
      }
    }
  }, [inView]);
  return (
    <div
      className="center maxWidthContainer gameModeContainerFull"
      ref={ref}
      style={{ flexDirection: "column" }}
      id="scrollGameMode"
    >
      <h3 className="coloredText">Play with your Boxing Boyz</h3>
      <h1 style={{ marginBottom: "30px" }}>GAME MODE</h1>
      <div className="column111">
        <motion.div animate={animation1} className="gameModeContainer">
          <img src={Training} />
        </motion.div>
        <motion.div animate={animation2} className="gameModeContainer">
          <img src={BattleArena} />
        </motion.div>
        <motion.div animate={animation3} className="gameModeContainer">
          <img src={Tournaments} />
        </motion.div>
      </div>
    </div>
  );
}
