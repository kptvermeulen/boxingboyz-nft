import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { FaBell } from "react-icons/fa";
import Bell from "assets/img/bell.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "styles/roadmap.css";

export default function Roadmap() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const roadmapContent = [
    {
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

  return (
    <div className="maxWidthContainer roadmapContainer" id="scrollRoadmap">
      <h3 className="coloredText">Ding ding ding!</h3>
      <h1 style={{ marginBottom: "25px" }}>ROUNDMAP</h1>
      <div className="carouselOverlay"></div>
      <Carousel
        centerMode={true}
        emulateTouch={true}
        showThumbs={false}
        onChange={(selectedIndex) => {
          setCurrentSlide(selectedIndex);
        }}
        swipeable={true}
        showStatus={false}
        preventMovementUntilSwipeScrollTolerance={true}
        centerSlidePercentage={window.innerWidth > 800 ? 70 : 90}
        renderIndicator={false}
        width={"100%"}
        dynamicHeight={false}
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <div
              className="nextBtnTimeline"
              style={{ right: "10px" }}
              onClick={onClickHandler}
            >
              <svg viewBox="0 0 320 512">
                <path
                  fill="currentColor"
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                ></path>
              </svg>
            </div>
          )
        }
        renderArrowPrev={() => {
          "";
        }}
      >
        {roadmapContent.map((indRoadmapContent, index) => {
          return (
            <div
              className={
                currentSlide === index
                  ? "timelineContainerBox selectedTimelineBox"
                  : "timelineContainerBox"
              }
            >
              <div className="container timelineContainer containerHighlight">
                <div className="timelineFlex">
                  <h2 className="timelineNumber coloredText">
                    {/*indRoadmapContent.index*/}
                    <img
                      alt="BB-bell"
                      src={Bell}
                      style={{
                        shapeRendering: "crispEdges",
                        fill: "url(#AccentGradient)",
                        marginRight: "15px",
                        width: "30px",
                        marginBottom: "10px",
                      }}
                    />
                  </h2>
                  <div className="timelineTitleContainer">
                    <h2 className="timelineTitle">{indRoadmapContent.title}</h2>
                    {/*<h3 className="coloredText timelineSubtitle">
                      {indRoadmapContent.subtitle}
            </h3>*/}
                    <p className="timelineParagraph">
                      {indRoadmapContent.content
                        .split("~n")
                        .map((paragraph) => {
                          return (
                            <>
                              {paragraph} <br />
                            </>
                          );
                        })}
                    </p>
                  </div>
                </div>
                <div className="timelineIndicator"></div>
              </div>
            </div>
          );
        })}
      </Carousel>
      <div className="timeLine"></div>
    </div>
  );
}
