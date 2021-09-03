import React, { useState, useEffect } from "react";
import { UNITS } from "./unitData";
import ProgressBar from "./components/ProgressBar";
import SingleUnit from "./components/SingleUnit";
import * as styles from "./Styles/AppStyles";
import HUD from "./components/HUD";

const ROWS = 5;
const COLS = 6;
const player = { health: 30, gold: 25 };
const computer = { health: 30, gold: 25 };

/* 

  TODO:
    something is off with the computers unit choices 
    cost of units & gold at the end of turn incorrect
    seems a minor gold sink has entered the game - maybe not a bad thing depending on balance

*/

function App() {
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const [computersTurn, setComputersTurn] = useState(true);
  const [playerUnitElements, setPlayerUnitElements] = useState([]);
  const [computerUnitElements, setComputerUnitElements] = useState([]);

  const [playerUnitMatrix, setPlayerUnitMatrix] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const [computerUnitMatrix, setComputerUnitMatrix] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  console.log(`playerUnitMatrix`, playerUnitMatrix);
  console.log(`computerUnitMatrix`, computerUnitMatrix);

  /*                       UNIT MATRIX INITS                      */

  if (playerUnitMatrix[0][0] === 0 && computerUnitMatrix[0][0] === 0) {
    setPlayerUnitMatrix((prev) =>
      prev.map((col) => col.map((val) => UNITS[val]))
    );
    setComputerUnitMatrix((prev) =>
      prev.map((col) => col.map((val) => UNITS[val]))
    );
  }

  useEffect(() => {
    createElementsFromMatrix();
    if (computersTurn) makeComputersMoves();
  }, [playerUnitMatrix, selectedUnit, computersTurn, computerUnitMatrix]);

  /*                          COMBAT LOGIC                         */

  const startRoundHandler = () => {
    setRoundStarted(true);
    startCombat();
  };

  const startCombat = () => {
    console.log("COMBAT STARTED");
    /* 
    due to the new structure revamp we can now loop forward through playerMatrix & it's sub-arrays
    while looping forward through computerMatrix and BACKWARDS through sub-arrys
    this will get us the units in the computersUnitMatrix by distance to the first row
    essentially reversing the grid to account for playerMatrix 00 === computerMatrix 04
    */
  };

  /*                          SHARED LOGIC                         */

  const createUnitElements = (target) => {
    const Elements = [];
    let targetMatrix;
    if (target === "player") targetMatrix = playerUnitMatrix;
    else if (target === "computer") targetMatrix = computerUnitMatrix;

    for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
      for (let colIdx = 0; colIdx < COLS; colIdx++) {
        Elements.push(
          <SingleUnit
            key={`${colIdx}/${rowIdx}`}
            colIdx={colIdx}
            rowIdx={rowIdx}
            changeUnitCb={() => placePlayerUnitHandler(colIdx, rowIdx)}
            unitId={targetMatrix[colIdx][rowIdx].id}
          />
        );
      }
    }
    return Elements;
  };

  const createElementsFromMatrix = () => {
    setPlayerUnitElements(createUnitElements("player"));
    setComputerUnitElements(createUnitElements("computer"));
  };

  /*                          PLAYER LOGIC                         */

  const placePlayerUnitHandler = (col, row) => {
    if (player.gold >= UNITS[selectedUnit].cost) {
      const newMatrix = [...playerUnitMatrix];
      newMatrix[col][row] = UNITS[selectedUnit];
      setPlayerUnitMatrix(newMatrix);
      player.gold = player.gold - UNITS[selectedUnit].cost;
    }
  };

  /*                          COMPUTER LOGIC                       */

  const randomIntExclusiveMax = (min = 0, max) =>
    Math.floor(Math.random() * (max - min) + min);

  const getComputersUnitChoice = () => {
    let goldCount = computer.gold;
    const chosenUnitIds = [];
    const unitValueToUnitIdMap = { 2: 1, 3: 2, 5: 3, 8: 4, 10: 5 };
    const unitValues = Object.keys(unitValueToUnitIdMap).map((val) => +val);

    while (goldCount > 10) {
      const randomIndex = randomIntExclusiveMax(1, 6);
      const randomUnit = UNITS[randomIndex];
      chosenUnitIds.push(randomIndex);
      goldCount -= randomUnit.cost;
    }
    while (goldCount > 1) {
      if (unitValues.includes(goldCount)) {
        chosenUnitIds.push(unitValueToUnitIdMap[goldCount]);
        goldCount = 0;
      } else {
        goldCount -= 1;
      }
    }

    const totalGoldCost = chosenUnitIds.reduce(
      (acc, cur) => acc + UNITS[cur].cost
    );
    computer.gold = computer.gold - totalGoldCost;

    return chosenUnitIds;
  };

  const getEmptySpace = (matrix) => {
    const columnsWithEmptySpaceHashmap = {};

    matrix.forEach((columnArray, colArrayIndex) => {
      const availableIndexsInColumnArray = columnArray.map((unit, unitIdx) => {
        if (unit.id === 0) return unitIdx;
      });
      if (availableIndexsInColumnArray.length) {
        columnsWithEmptySpaceHashmap[colArrayIndex] =
          availableIndexsInColumnArray;
      }
    });

    const hashKeys = Object.keys(columnsWithEmptySpaceHashmap);
    if (hashKeys.length) {
      const columnArrayIndex =
        hashKeys[randomIntExclusiveMax(0, hashKeys.length)];
      const randomAvailableIndex = randomIntExclusiveMax(
        0,
        columnsWithEmptySpaceHashmap[columnArrayIndex].length
      );

      const availableIndex =
        columnsWithEmptySpaceHashmap[columnArrayIndex][randomAvailableIndex];

      return {
        columnArrayIndex: columnArrayIndex,
        availableIndex: availableIndex,
        isSpace: true,
      };
    } else
      return { columnArrayIndex: null, availableIndex: null, isSpace: false };
  };

  const makeComputersMoves = () => {
    const chosenUnits = getComputersUnitChoice();
    let _computerUnitMatrix = [...computerUnitMatrix];
    for (const unitId of chosenUnits) {
      const { columnArrayIndex, availableIndex, isSpace } =
        getEmptySpace(_computerUnitMatrix);
      if (isSpace) {
        _computerUnitMatrix[columnArrayIndex].splice(
          availableIndex,
          1,
          UNITS[unitId]
        );
      } else {
        console.log(`No Space`);
      }
    }

    computer.gold = computer.gold + 25;
    player.gold = player.gold + 25;
    setComputersTurn(false);
    setComputerUnitMatrix(_computerUnitMatrix);
  };

  /*                           ELEMENTS                             */

  return (
    <styles.AppWrapper>
      <styles.BoardWrapper>
        <HUD health={computer.health} gold={computer.gold} />
        <styles.ComputerGrid>{computerUnitElements}</styles.ComputerGrid>
        <styles.RoundTimer>
          <ProgressBar
            shouldStart={roundStarted}
            stopRoundCb={() => {
              setRoundStarted(false);
              setComputersTurn(false);
            }}
          />
          <styles.StartCombatButton onClick={() => startRoundHandler()}>
            {/* <styles.StartCombatButton onClick={() => makeComputersMoves()}> */}
            Start Round
          </styles.StartCombatButton>
        </styles.RoundTimer>

        <styles.PlayerGrid>{playerUnitElements}</styles.PlayerGrid>
        <HUD
          health={player.health}
          gold={player.gold}
          selectedUnit={selectedUnit}
          setSelectedUnitCb={(unitId) => setSelectedUnit(unitId)}
        />
      </styles.BoardWrapper>
    </styles.AppWrapper>
  );
}

export default App;
