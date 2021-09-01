import React, { useState, useEffect } from "react";

import styled from "styled-components";

const BAR_COLORS = {
  10: "lightgreen",
  20: "lightgreen",
  30: "green",
  40: "green",
  50: "yellow",
  60: "yellow",
  70: "orange",
  80: "orange",
  90: "red",
  100: "red",
};

const LoadingBar = styled.div`
  margin: auto;
  position: relative;
  background: grey;
  width: 800px;
  height: 30px;
  border-radius: 50px;
  p {
    width: 200px;
    color: brown;
    mix-blend-mode: difference;
    position: absolute;
    bottom: -23px;
    left: calc(50% - 100px);
    font-size: 25px;
    text-align: center;
  }
`;

const Fill = styled.div`
  background-color: ${(props) => `${BAR_COLORS[props.percent]}`};
  margin: auto auto auto 0;
  height: 100%;
  transition: width 0.2s ease-in, background-color 0.2s ease-in;
  width: ${(props) => `${props.percent}%`};
  border-radius: inherit;
`;

export default function ProgressBar({ shouldStart, stopRoundCb }) {
  const [percent, setPercent] = useState(0);
  let timerFn = null;

  useEffect(() => {
    if (shouldStart) {
      if (timerFn) {
        clearInterval(timerFn);
        timerFn = null;
      }
      timerFn = setInterval(() => {
        setPercent((prev) => {
          if (prev === 100) {
            stopRoundCb();
            clearInterval(timerFn);
            timerFn = null;
            return 0;
          }
          return prev + 10;
        });
      }, 1000);
    }
  }, [shouldStart]);

  return (
    <LoadingBar>
      {percent !== 0 ? (
        <p>{Math.abs((percent - 10) / 10 - 10)}s</p>
      ) : (
        <p>Build Phase</p>
      )}
      <Fill percent={percent}></Fill>
    </LoadingBar>
  );
}
