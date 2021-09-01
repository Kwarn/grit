import React, { useState, useEffect } from "react";
import * as styles from "./Styles/AppStyles";
import ProgressBar from "./components/ProgressBar";
import SingleUnit from "./components/SingleUnit";

const ROWS = 5;
const COLS = 6;
const UNITS = {
  0: { name: "Space", health: 0, damage: 0, cost: 0 },
  1: { name: "Sand Bags", health: 4, damage: 0, cost: 2 },
  2: { name: "Soldier", health: 1, damage: 2, cost: 3 },
  3: { name: "Turret", health: 2, damage: 6, cost: 5 },
  4: { name: "Tank", health: 5, damage: 4, cost: 8 },
  5: { name: "Heli", health: 2, damage: 6, cost: 10 },
};

const player = { health: 30, gold: 50 };
const computer = { health: 30, gold: 25 };

function App() {
  const [playerMatrix, setPlayerMatrix] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const [computerMatrix, setComputerMatrix] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const [playerMatrixElements, setPlayerMatrixElements] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const [computersTurn, setComputersTurn] = useState(false);
  const [computerMatrixElements, setComputerMatrixElements] = useState([]);

  const makeComputersMoves = () => {
    const randomNum = (max) => Math.floor(Math.random() * max);
    console.log(randomNum(6));

    createElementsFromMatrix("computer");
    // select from [1/2][random]
  };

  useEffect(() => {
    createElementsFromMatrix("player");
    if (computersTurn) makeComputersMoves();
  }, [playerMatrix, selectedUnit, computersTurn]);

  const changeUnitHandler = (x, y) => {
    if (player.gold >= UNITS[selectedUnit].cost) {
      const newMatrix = [...playerMatrix];
      newMatrix[x][y] = selectedUnit;
      setPlayerMatrix(newMatrix);
      player.gold = player.gold - UNITS[selectedUnit].cost;
    }
  };

  const createPlayerElements = () => {
    const Elements = [];
    for (let colIdx = 0; colIdx < COLS; colIdx++) {
      for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
        const uid = playerMatrix[colIdx][rowIdx];
        Elements.push(
          <SingleUnit
            key={`${colIdx}/${rowIdx}`}
            colIdx={colIdx}
            rowIdx={rowIdx}
            changeUnitCb={() => changeUnitHandler(colIdx, rowIdx)}
            unitId={uid}
          />
        );
      }
    }
    return Elements;
  };

  const createComputerElements = () => {
    const Elements = [];
    for (let colIdx = COLS - 1; colIdx >= 0; colIdx--) {
      for (let rowIdx = ROWS - 1; rowIdx >= 0; rowIdx--) {
        console.log(`computerMatrix`, computerMatrix);
        const uid = computerMatrix[colIdx][rowIdx];
        console.log(`uid`, uid);
        Elements.unshift(
          <SingleUnit
            key={`${colIdx}/${rowIdx}`}
            colIdx={colIdx}
            rowIdx={rowIdx}
            changeUnitCb={() => changeUnitHandler(colIdx, rowIdx)}
            unitId={uid}
          />
        );
      }
    }
    return Elements;
  };

  const createElementsFromMatrix = (targetMatrix) => {
    switch (targetMatrix) {
      case "player":
        const PlayerElementArray = createPlayerElements();
        setPlayerMatrixElements(PlayerElementArray);
        break;
      case "computer":
        const ComputerElementsArray = createComputerElements();
        setComputerMatrixElements(ComputerElementsArray);
        break;
      default:
        return;
    }
  };

  const selectUnitCards = Object.keys(UNITS).map((key) => {
    if (+key !== 0) {
      const isUnlocked = player.gold >= UNITS[key].cost;
      return (
        <styles.Unit
          key={`choice ${key}`}
          isSelected={selectedUnit === key}
          onClick={() => (isUnlocked ? setSelectedUnit(key) : null)}
          unitId={key}
          isUnlocked={isUnlocked}
        >
          <div>
            <p>{UNITS[key].name}</p>
            <p>HP: {UNITS[key].health}</p>
            <p>DMG: {UNITS[key].damage}</p>
            <p>COST: {UNITS[key].cost}</p>
          </div>
        </styles.Unit>
      );
    }
  });

  // console.log(`playerMatrix`, playerMatrix);
  // console.log("playerMatrixElements", playerMatrixElements);
  console.log(`selectedUnit`, selectedUnit);
  return (
    <styles.AppWrapper>
      <styles.BoardWrapper>
        <styles.TopHudWrapper>
          <styles.Player1Hud>
            <p>Health: {player.health}</p>
            <p>Gold: {player.gold}</p>
            <button onClick={() => setRoundStarted(!roundStarted)}>
              {/* <button onClick={() => makeComputersMoves()}> */}
              Start Round
            </button>
          </styles.Player1Hud>
          <styles.UnitContainer>{selectUnitCards}</styles.UnitContainer>
        </styles.TopHudWrapper>
        <styles.BoardGridTop>{playerMatrixElements}</styles.BoardGridTop>
        <styles.RoundTimer>
          <ProgressBar
            shouldStart={roundStarted}
            stopRoundCb={() => {
              setRoundStarted(false);
              setComputersTurn(true);
            }}
          />
        </styles.RoundTimer>
        <styles.BoardGridBottom>
          {computerMatrixElements}
        </styles.BoardGridBottom>
      </styles.BoardWrapper>
    </styles.AppWrapper>
  );
}

export default App;
