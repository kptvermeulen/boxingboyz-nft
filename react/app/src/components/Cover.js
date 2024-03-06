import React, { useEffect, useState } from "react";
import Header from "./../assets/img/header.jpeg";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Cover({ aS, iA, tH }) {
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
    <div ref={ref}>
      <motion.div
        className="maxWidthContainer desktop350px"
        animate={animation}
      >
        <img src={Header} style={{ width: "100%", borderRadius: "30px" }} />
      </motion.div>
    </div>
  );
}
