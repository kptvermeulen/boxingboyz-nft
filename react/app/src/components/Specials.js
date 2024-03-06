import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Popup } from "libraries/functions";
import merch from "./../assets/img/Black_Hoodie_Mockup.png";

export default function Partners({ aS, iA, tH }) {
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
      ref={ref}
      className="maxWidthContainer "
      style={{ padding: "100px 50px" }}
    >
      <div className="column11">
        <motion.div
          animate={animation1}
          className="container center containerHighlight"
          style={{
            backgroundColor: "#aaa",
            background: "linear-gradient(146.1deg, #bbb 2.22%, #666 89.02%)",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={() => {
            Popup(
              "Website coming soon",
              "This website is not available yet. Please try again later."
            );
          }}
        >
          <div className="column11" style={{ width: "100%", height: "140px" }}>
            <div className="" style={{ width: "100%" }}>
              <h2 style={{ color: "black", fontSize: "28px" }}>Merchandise</h2>
              <h3
                style={{ color: "black", marginTop: "10px", textAlign: "left" }}
              >
                Take a look at our merchandise page. (coming soon)
              </h3>
              <div
                style={{
                  padding: "10px 20px",
                  width: "100px",
                  marginTop: "20px",
                  position: "relative",
                  bottom: "0px",
                }}
                className="btn roundBtn"
              >
                Visit Store
              </div>
            </div>
            <div className="removeOnSmallScreen" style={{ width: "100%" }}>
              <img
                style={{
                  height: "200px",
                  position: "absolute",
                  top: "0px",
                }}
                src={merch}
                alt="boxing-boyz-merchandise"
              ></img>
            </div>
          </div>
        </motion.div>
        <motion.div
          animate={animation1}
          className="container center containerHighlight"
          style={{
            height: "60px 0px",
            backgroundColor: "#aaa",
            background:
              "linear-gradient(146.1deg, var(--accent) 2.22%, var(--secondaccent) 89.02%)",
            cursor: "pointer",
          }}
          onClick={() => {
            Popup(
              "Website coming soon",
              "This website is not available yet. Please try again later."
            );
          }}
        >
          <div className="column11" style={{ width: "100%", height: "140px" }}>
            <div className="" style={{ width: "100%" }}>
              <h2 style={{ fontSize: "28px" }}>Fighting</h2>
              <h3 style={{ marginTop: "10px", textAlign: "left" }}>
                Battle against your friends and win BoxingBoyz tokens!
              </h3>
              <div
                style={{
                  padding: "10px 20px",
                  width: "220px",
                  marginTop: "20px",
                  position: "relative",
                  bottom: "0px",
                }}
                className="btn roundBtn btnWhite removeOnSmallScreen"
              >
                Go To Fighting Arena
              </div>
            </div>
            <div
              className="removeOnSmallScreen"
              style={{ width: "100%", display: "none" }}
            >
              <img
                style={{ height: "200px", position: "absolute", top: "0px" }}
                src={merch}
                alt="boxing-boyz-merchandise"
              ></img>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
