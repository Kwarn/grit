import React, { useState, useEffect } from "react";
import { UNITS } from "./unitData";
import ProgressBar from "./components/ProgressBar";
import SingleUnit from "./components/SingleUnit";
import * as styles from "./Styles/AppStyles";
import HUD from "./components/HUD";

const ROWS = 5;
const COLS = 6;
const player = { health: 30, gold: 0 };
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

  const [playersUnitsByLocation, setPlayersUnitsByLocation] = useState({});
  const [playerUnitLocationsMatrix, setPlayerUnitLocationsMatrix] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const [computersUnitsByLocation, setComputersUnitsByLocation] = useState({});
  const [computerUnitLocationsMatrix, setComputerUnitLocationsMatrix] =
    useState([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

  // console.log(`playersUnitsByLocation`, playersUnitsByLocation);
  // console.log(`computersUnitsByLocation`, computersUnitsByLocation);
  // console.log(`playerUnitLocationsMatrix`, playerUnitLocationsMatrix);
  // console.log(`computerUnitLocationsMatrix`, computerUnitLocationsMatrix);

  useEffect(() => {
    createElementsFromMatrix();
    if (computersTurn) makeComputersMoves();
  }, [
    playerUnitLocationsMatrix,
    selectedUnit,
    computersTurn,
    computerUnitLocationsMatrix,
  ]);

  /*                          COMBAT LOGIC                         */

  const startRoundHandler = () => {
    setRoundStarted(!roundStarted);
  };

  const startCombat = () => {
    // loop through players units by column
    // check if a unit is in the same column on computers row
    // if unit is reduce it's health by the players unit's damage
    // if damage is more than health move to next row
    // if no units are found damage players health bar
  };

  /*                          SHARED LOGIC                         */

  const createUnitElements = (target) => {
    const Elements = [];
    let targetMatrix;
    if (target === "player") {
      targetMatrix = playerUnitLocationsMatrix;
    } else if (target === "computer") {
      targetMatrix = computerUnitLocationsMatrix;
    }
    for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
      for (let colIdx = 0; colIdx < COLS; colIdx++) {
        const uid = targetMatrix[colIdx][rowIdx];
        Elements.push(
          <SingleUnit
            key={`${colIdx}/${rowIdx}`}
            colIdx={colIdx}
            rowIdx={rowIdx}
            changeUnitCb={() => placePlayerUnitHandler(colIdx, rowIdx)}
            unitId={uid}
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
      const newMatrix = [...playerUnitLocationsMatrix];
      newMatrix[col][row] = selectedUnit;
      setPlayerUnitLocationsMatrix(newMatrix);
      setPlayersUnitsByLocation((prev) => {
        return {
          ...prev,
          [col]: { ...prev[col], [row]: UNITS[selectedUnit] },
        };
      });
      player.gold = player.gold - UNITS[selectedUnit].cost;
    }
  };

  /*                          COMPUTER LOGIC                       */

  const mapUnitsToLocations = (locationMatrix) => {
    let _computersUnitsByLocation = {};
    locationMatrix.forEach((colArray, colArrayIdx) => {
      colArray.forEach((unitId, unitIdx) => {
        if (unitId !== 0) {
          _computersUnitsByLocation[colArrayIdx] = {
            ..._computersUnitsByLocation[colArrayIdx],
            [unitIdx]: UNITS[unitId],
          };
        }
      });
    });

    setComputersUnitsByLocation(_computersUnitsByLocation);
  };

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
    console.log(`totalGoldCost`, totalGoldCost);
    computer.gold = computer.gold - totalGoldCost;

    return chosenUnitIds;
  };

  const getEmptySpace = (matrix) => {
    const columnsWithEmptySpaceHashmap = {};
    matrix.forEach((columnArray, colArrayIndex) => {
      const availableIndexsInColumnArray = columnArray
        .map((val, valIdx) => (val === 0 ? valIdx : null))
        .filter((idx) => idx !== null);
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
    let _locationMatrix = [...computerUnitLocationsMatrix];
    for (const unitId of chosenUnits) {
      const { columnArrayIndex, availableIndex, isSpace } =
        getEmptySpace(_locationMatrix);
      if (isSpace) {
        _locationMatrix[columnArrayIndex].splice(availableIndex, 1, unitId);
      } else {
        console.log(`No Space`);
      }
    }

    mapUnitsToLocations(_locationMatrix);
    computer.gold = computer.gold + 25;
    player.gold = player.gold + 25;
    setComputersTurn(false);

    setComputerUnitLocationsMatrix(_locationMatrix);
  };

  /*                           ELEMENTS                             */

  return (
    <styles.AppWrapper>
      <styles.BoardWrapper>
        <styles.ComputerHud>
          <p>Health: {computer.health}</p>
          <p>Gold: {computer.gold}</p>
        </styles.ComputerHud>

        <styles.ComputerGrid>{computerUnitElements}</styles.ComputerGrid>
        <styles.RoundTimer>
          <ProgressBar
            shouldStart={roundStarted}
            stopRoundCb={() => {
              setRoundStarted(false);
              setComputersTurn(true);
            }}
          />
          <button onClick={() => startRoundHandler()}>
            {/* <button onClick={() => makeComputersMoves()}> */}
            Start Round
          </button>
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
