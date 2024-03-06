import React, { useState, useEffect } from "react";
import Header from "components/Header";
import {
  loadCount,
  connectToBlockchain,
  isConnectedToBlockchain,
  initWeb3,
} from "../libraries/Blockchain";

export default function LiveCount({ dL }) {
  const [count, setCount] = useState(10000);

  const componentDidMount = async () => {
    try {
      let result = await initWeb3();
      if (!result) {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return;
      }

      await connectToBlockchain();
    } catch (err) {
      console.log(err);
      alert("Error: Please reload the page");
    }
  };

  async function getCount() {
    await componentDidMount();
    if (isConnectedToBlockchain()) {
      let countPre = await loadCount();
      setCount(countPre);
    }
  }

  useEffect(() => {
    getCount();
    setInterval(() => {
      getCount();
    }, 1000);
  }, []);

  return (
    <>
      <Header discordLink={dL} />
      <div
        className="center"
        style={{ height: "100vh", width: "100vw", flexDirection: "column" }}
      >
        <div className="flex">
          <h1 style={{ fontSize: "10vw" }}>{count}</h1>
          <h2 className="coloredText" style={{ paddingLeft: "25px" }}>
            /10000
          </h2>
        </div>
      </div>
    </>
  );
}
