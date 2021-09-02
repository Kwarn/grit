import React, { useState, useEffect } from "react";
import { UNITS } from "./UnitValues";
import ProgressBar from "./components/ProgressBar";
import SingleUnit from "./components/SingleUnit";
import * as styles from "./Styles/AppStyles";

const ROWS = 5;
const COLS = 6;
const player = { health: 30, gold: 0 };
const computer = { health: 30, gold: 25 };

// obj { "01": {unitId} }

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

  console.log(`playersUnitsByLocation`, playersUnitsByLocation);
  console.log(`computersUnitsByLocation`, computersUnitsByLocation);
  console.log(`playerUnitLocationsMatrix`, playerUnitLocationsMatrix);
  console.log(`computerUnitLocationsMatrix`, computerUnitLocationsMatrix);

  useEffect(() => {
    createElementsFromMatrix();
    if (computersTurn) makeComputersMoves();
  }, [
    playerUnitLocationsMatrix,
    selectedUnit,
    computersTurn,
    computerUnitLocationsMatrix,
  ]);

  const startRoundHandler = () => {
    setRoundStarted(!roundStarted);
  };

  /*                          SHARED                               */

  const createUnitElements = (target) => {
    const Elements = [];
    let targetMatrix;
    let setTargetMatrix;
    if (target === "player") {
      targetMatrix = playerUnitLocationsMatrix;
      setTargetMatrix = setPlayerUnitElements;
    } else if (target === "computer") {
      targetMatrix = computerUnitLocationsMatrix;
      setTargetMatrix = setComputerUnitElements;
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

  const createElementsFromMatrix = () => {
    setPlayerUnitElements(createUnitElements("player"));
    setComputerUnitElements(createUnitElements("computer"));
  };

  /*                         PLAYER                                */

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

  /*                         COMPUTER                              */

  const randomIntExclusiveMax = (min = 0, max) =>
    Math.floor(Math.random() * (max - min) + min);

  const choseComputersUnits = () => {
    let goldCount = computer.gold;
    const chosenUnits = [];
    const unitValueToUnitIdMap = { 2: 1, 3: 2, 5: 3, 8: 4, 10: 5 };
    const unitValues = Object.keys(unitValueToUnitIdMap).map((val) => +val);

    while (goldCount > 10) {
      const randomIndex = randomIntExclusiveMax(1, 6);
      const randomUnit = UNITS[randomIndex];
      chosenUnits.push(randomIndex);
      goldCount -= randomUnit.cost;
    }
    while (goldCount > 1) {
      if (unitValues.includes(goldCount)) {
        chosenUnits.push(unitValueToUnitIdMap[goldCount]);
        goldCount = 0;
      } else goldCount -= 1;
    }

    computer.gold = computer.gold -= chosenUnits.reduce(
      (acc, cur) => acc + UNITS[cur].cost
    );

    return chosenUnits;
  };

  const getEmptySpace = (matrix) => {
    const hash = {};
    matrix.forEach((columnArray, colArrayIndex) => {
      const availableIndexsInColumnArray = columnArray
        .map((val, valIdx) => (val === 0 ? valIdx : null))
        .filter((idx) => idx !== null);
      if (availableIndexsInColumnArray.length) {
        hash[colArrayIndex] = availableIndexsInColumnArray;
      }
    });
    const hashKeys = Object.keys(hash);
    if (hashKeys.length) {
      const columnArrayIndex =
        hashKeys[randomIntExclusiveMax(0, hashKeys.length)];
      const randomAvailableIndex = randomIntExclusiveMax(
        0,
        hash[columnArrayIndex].length
      );
      const availableIndex = hash[columnArrayIndex][randomAvailableIndex];
      return {
        columnArrayIndex: columnArrayIndex,
        availableIndex: availableIndex,
        isSpace: true,
      };
    } else
      return { columnArrayIndex: null, availableIndex: null, isSpace: false };
  };

  const makeComputersMoves = () => {
    const chosenUnits = choseComputersUnits();
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
    // setComputersUnitsByLocation(_computersUnitsByLocation);
  };

  return (
    <styles.AppWrapper>
      <styles.BoardWrapper>
        <styles.TopHudWrapper>
          <styles.Player1Hud>
            <p>Health: {player.health}</p>
            <p>Gold: {player.gold}</p>
            {/* <button onClick={() => startRoundHandler()}> */}
            <button onClick={() => makeComputersMoves()}>Start Round</button>
          </styles.Player1Hud>
          <styles.UnitContainer>{selectUnitCards}</styles.UnitContainer>
        </styles.TopHudWrapper>
        <styles.BoardGridTop>{playerUnitElements}</styles.BoardGridTop>
        <styles.RoundTimer>
          <ProgressBar
            shouldStart={roundStarted}
            stopRoundCb={() => {
              setRoundStarted(false);
              setComputersTurn(true);
            }}
          />
        </styles.RoundTimer>
        <styles.BoardGridBottom>{computerUnitElements}</styles.BoardGridBottom>
        <styles.BottomHudWrapper>
          <styles.ComputerHud>
            <p>Health: {computer.health}</p>
            <p>Gold: {computer.gold}</p>
          </styles.ComputerHud>
        </styles.BottomHudWrapper>
      </styles.BoardWrapper>
    </styles.AppWrapper>
  );
}

export default App;
