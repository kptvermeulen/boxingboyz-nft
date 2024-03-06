import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "styles/vertical-roadmap.css";

export default function Details({ aS, iA, tH }) {
  const [ref, inView] = useInView();
  const [animated, setAnimated] = useState(false);
  const content = [
    {
      index: "10%",
      title: "WELCOME TO THE TEAM",
      subtitle: "When 10% has been sold",
      content:
        "Congratulations, you have been chosen to train with us. Join the community on Discord and be sure to claim your spot in the ring.",
    },
    {
      index: "20%",
      title: "BUILDING THE TEAM",
      subtitle: "When 20% has been sold",
      content:
        "As a boxer you first need to build a team around you. A $50.000 fund will be granted in order to finance future community activities, new development and marketing campaigns.  ",
    },
    {
      index: "40%",
      title: "BECOMING A BOXER",
      subtitle: "When 40% has been sold",
      content:
        "After collaborating with big names in the fighting industry it’s time to reveal the next partners that will enter the ring with the Boxing Boyz. All the partners of the Boxing Boyz are now revealed and they are ready to rumble! ",
    },
    {
      index: "60%",
      title: "THE FIRST FIGHT",
      subtitle: "When 60% has been sold",
      content:
        "Your first fight is always the most exciting one! Use your own Boxing Boy to fight tournaments against other Boxing Boyz and win major rewards or tokens.",
    },
    {
      index: "80%",
      title: "IMPROVING YOUR SKILLS",
      subtitle: "When 80% has been sold",
      content:
        "After the first fight you need to keep improving your skills. 25% of the royalties will be allocated to our community driven fund. This fund will make sure that the Boxing Boyz keep improving. All holders will have equal voting rights to decide what to do with the money.",
    },
    {
      index: "100%",
      title: "BECOMING A CHAMPION",
      subtitle: "When 100% has been sold",
      content:
        "All the Boxing Boyz are minted and waiting for the reveal. Our world champions are hiding among the others. Game development will be accelerated and marketing campaigns will be expanded. Are you ready to become the next champion?",
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
      style={{ padding: "50px 25px", position: "relative" }}
      id="scrollRoadmap"
      ref={ref}
    >
      <h3 className="coloredText">For the comunity</h3>
      <h1 style={{ marginBottom: "40px" }}>LAUNCH ROADMAP</h1>
      <div className="rmsTimeline removeOnSmallScreen"></div>
      <div className="vTimelineIndicatorContainer removeOnSmallScreen">
        <div className="vTimelineIndicator"></div>
      </div>
      <div style={{ marginTop: "80px" }}>
        {content.map((indContent, index) => {
          return (
            <motion.div
              animate={animations[index]}
              className="timelineContainerBox"
            >
              <div className="container timelineContainer containerHighlight">
                <div className="timelineFlex">
                  <h2 className="timelineNumber coloredText">
                    {indContent.index}
                  </h2>
                  <div className="timelineTitleContainer">
                    <h2 className="timelineTitle">{indContent.title}</h2>
                    {/*<h3 className="coloredText timelineSubtitle">
                      {indRoadmapContent.subtitle}
            </h3>*/}
                    <p className="timelineParagraph">{indContent.content}</p>
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
