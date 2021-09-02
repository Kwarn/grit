import React, { useState, useEffect } from "react";
import * as styles from "./Styles/AppStyles";
import ProgressBar from "./components/ProgressBar";
import SingleUnit from "./components/SingleUnit";
import { UNITS } from "./UnitValues";

const ROWS = 5;
const COLS = 6;

const player = { health: 30, gold: 25 };
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

  const [selectedUnit, setSelectedUnit] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const [computersTurn, setComputersTurn] = useState(false);
  const [playerMatrixElements, setPlayerMatrixElements] = useState([]);
  const [computerMatrixElements, setComputerMatrixElements] = useState([]);

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
    // store all combinations in array
    const hash = {};
    matrix.forEach((row, idx) => {
      const availableColsInRow = row
        .map((col, idx) => (col === 0 ? idx : null))
        .filter((val) => val !== null);
      if (availableColsInRow.length > 0) {
        hash[idx] = availableColsInRow;
      }
    });
    const hashKeys = Object.keys(hash);
    if (hashKeys.length) {
      console.log(`hash`, hash);
      const row = hashKeys[randomIntExclusiveMax(0, hashKeys.length)];
      // console.log(`row`, row);
      const colIndexInRow = randomIntExclusiveMax(0, hash[row].length);
      // console.log(`colIndexInRow`, colIndexInRow);
      const col = hash[row][colIndexInRow];
      // console.log(`col`, col);
      return { row: row, col: col, isSpace: true };
    } else return { row: null, col: null, isSpace: false };
  };

  const makeComputersMoves = () => {
    const chosenUnits = choseComputersUnits();
    let _matrix = [...computerMatrix];
    for (const unit of chosenUnits) {
      const { row, col, isSpace } = getEmptySpace(_matrix);
      if (isSpace) {
        _matrix[row].splice(col, 1, unit);
      } else {
        console.log(`No Space`);
      }
    }
    computer.gold = computer.gold + 25;
    player.gold = player.gold + 25;
    setComputersTurn(false);

    setComputerMatrix(_matrix);
  };

  useEffect(() => {
    createElementsFromMatrix("player");
    createElementsFromMatrix("computer");
    if (computersTurn) makeComputersMoves();
  }, [playerMatrix, selectedUnit, computersTurn, computerMatrix]);

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
        const uid = computerMatrix[colIdx][rowIdx];
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
