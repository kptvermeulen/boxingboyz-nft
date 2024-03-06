import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "styles/gamemodes.css";

export default function TimelineRoadmap({ aS, iA, tH }) {
  const [ref, inView] = useInView();
  const [animated, setAnimated] = useState(false);
  const content = [
    {
      title: "Pre Fight",
      content:
        "During this phase we’re developing deeper aspects of our play to earn game and fine tuning the details. We are also raising capital to truly bring this project to life. ",
    },
    {
      title: "Round 1-4",
      content:
        "Round 1. Build a community~nHere we begin building a strong community of committed supporters that will bring Boxing Boyz to life. ~n~nRound 2. Pre sale~nWe’ll open presale during this phase, and those who earn a whitelist spot can get in early on the action.~n~nRound 3. Reveal huge partnership~nAt the end of this phase we’ll announce a HUGE PARTNERSHIP that will be a real game changer.  ~n~nRound 4. NFT Launch~n5,000 uniquely generated boxing characters 🥊 will drop, giving all of you guys access to our exciting new NFT.",
    },
    {
      title: "Round 5-8",
      content:
        "Round 5. IDO~nOnce this phase begins we’ll launch our IDO, really kicking things off.~n~nRound 6. Token launch~nFinally, you’ll be able to get your hands on $BOXING!~n~nRound 7. Additional DEX listings~nHere you’ll be able to exchange your $BOXING tokens on more exchanges.~n~nRound 8. Staking~nStaking of $BOXING will be released here.",
    },
    {
      title: "Round 9-11",
      content:
        "Round 9. Marketplace~nOur marketplace launches here, so look forward to plenty of purchasable items to make your NFT even more powerful or unique. ~n~nRound 10. Battle arena~nUse the items purchased in our marketplace to show your opponents who the strongest Boxing Boyz fighter is!~n~nRound 11. Tournaments~nFinally, tournaments with huge prizes will begin here. That’s what we’re all staying for!",
    },
    {
      title: "Round 12",
      content:
        "Round 12. Full game launch~nThe game is complete and we launch in full!",
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

  function isEven(value) {
    if (value % 2 == 0) return true;
    else return false;
  }

  return (
    <div
      className="maxWidthContainer"
      style={{
        padding: "75px 25px",
        marginBottom: "150px",
        position: "relative",
      }}
      id="scrollRoadmap"
      ref={ref}
    >
      <h3 className="coloredText">Ding ding ding!</h3>
      <h1 style={{ marginBottom: "40px" }}>ROUNDMAP</h1>
      <div className="NrmsTimelineContainer">
        <div className="NrmsTimeline"></div>
      </div>
      <div style={{ marginTop: "80px" }}>
        {content.map((indContent, index) => {
          return (
            <motion.div
              animate={animations[index]}
              className={
                isEven(index) ? "NTimelineContainer1" : "NTimelineContainer2"
              }
            >
              <div className="container timelineContainer containerHighlight">
                <div className="timelineIndicator">
                  <div className="timelineIndicatorCircle"></div>
                </div>
                <div className="timelineFlex">
                  <div className="timelineTitleContainer">
                    <h2 className="timelineTitle">{indContent.title}</h2>
                    <p className="timelineParagraph">
                      {indContent.content.split("~n").map((paragraph) => {
                        if (paragraph.includes("Round")) {
                          return (
                            <>
                              <b>{paragraph}</b> <br />
                            </>
                          );
                        } else {
                          return (
                            <>
                              {paragraph} <br />
                            </>
                          );
                        }
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
