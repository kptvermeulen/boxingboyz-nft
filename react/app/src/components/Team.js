import React from "react";
import Owner1 from "assets/img/team/Owner1.jpeg";
import Owner2 from "assets/img/team/Owner2.jpeg";
import Designer from "assets/img/team/Designer.jpeg";
import Marketing from "assets/img/team/Marketing.jpeg";
import Developer from "assets/img/team/Developer.jpeg";
import GameDeveloper from "assets/img/team/gameDev.jpeg";
import Fury from "assets/img/team/Fury.jpeg";
import Mike from "assets/img/team/Mike.jpeg";
import Utherverse from "assets/img/team/Utherverse.jpeg";
import BB from "assets/img/team/BoxingBoyzInitial.png";

export default function Team() {
  return (
    <div className="maxWidthContainer teamContainerContainer" id="scrollTeam">
      <h3 className="coloredText">The Hall Of Fame</h3>
      <h1 style={{ marginBottom: "20px" }}>TEAM MEMBERS</h1>
      <div className="column1111">
        <div className="teamContainer">
          <img alt="team member" src={Mike} />
          <h2 className="nameText">Mike "Quick" Swick</h2>
          <h2 className="coloredText functionText">Co-founder</h2>
        </div>
        <div className="teamContainer">
          <img alt="team member" src={Fury} />
          <h2 className="nameText">Fury</h2>
          <h2 className="coloredText functionText">Co-founder</h2>
        </div>
        <div className="teamContainer">
          <img alt="team member" src={Owner1} />
          <h2 className="nameText">The Greatest</h2>
          <h2 className="coloredText functionText">Co-owner</h2>
        </div>
        <div className="teamContainer">
          <img alt="team member" src={Owner2} />
          <h2 className="nameText">The Hitman</h2>
          <h2 className="coloredText functionText">Co-owner</h2>
        </div>
      </div>
      <div className="column1111">
        <div className="teamContainer">
          <img alt="team member" src={Designer} />
          <h2 className="nameText">Stone Hands</h2>
          <h2 className="coloredText functionText">Artist</h2>
        </div>
        <div className="teamContainer">
          <img alt="team member" src={Marketing} />
          <h2 className="nameText">The Italian Stallion</h2>
          <h2 className="coloredText functionText">Marketing specialist</h2>
        </div>
        <div className="teamContainer">
          <img alt="team member" src={Developer} />
          <h2 className="nameText">The Real Deal</h2>
          <h2 className="coloredText functionText">Developer</h2>
        </div>
        <div className="teamContainer">
          <img alt="team member" src={Utherverse} />
          <h2 className="nameText">Marvelous</h2>
          <h2 className="coloredText functionText">Game developer</h2>
        </div>
      </div>
    </div>
  );
}
