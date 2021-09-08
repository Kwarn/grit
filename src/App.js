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
    issues:

      something is off with the computers unit choices & gold tally at end of round
      units still attack after being destroyed
      ProgressBar component is trying to update state after it's dismounted

      
    thoughts: 

      control animations and setIntervals with this
      useState(Unit attacking: unitIdx, unit defending: unitIdx, damage)
      <SingleUnit css = if attacking animate, if defending animate, if damaged animate damage marker/>


    TODO:

      improve unit selection and placement for AI, sandbags closer & helicopters further back
      seperate logic into different files as it's getting hard to read
    

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

  // console.log(`playerUnitMatrix`, playerUnitMatrix);
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

  const damageUnit = (damage, unit) => {
    const damagedUnit =
      damage < unit.health
        ? {
            ...unit,
            health: unit.health - damage,
          }
        : null;

    return {
      damagedUnit: damagedUnit,
      overkillDamage: damage > unit.health ? damage - unit.health : 0,
    };
  };

  const damageUnits = (damage, unitArray) => {
    // unitArray = [{unit},{unit},{unit},{unit},{unit}]
    // loops through a unit array applying damage to units
    // carries over unspent damage until either all units are dead with damage left
    // or damage is absorbed
    // returns the new array of damaged units and the amount of damage not spent
    // unspent damage is later applied to player/computer health.

    if (!unitArray.filter((unit) => unit.id !== 0).length > 0)
      return { updatedUnits: unitArray, excessDamage: damage };

    let updatedUnits = [...unitArray];
    let unitIdx = 0;
    let dmg = damage;

    while (dmg && unitIdx < ROWS) {
      const unit = updatedUnits[unitIdx];
      if (unit.id === 0) {
        unitIdx += 1;
        continue;
      }
      const { damagedUnit, overkillDamage } = damageUnit(dmg, unit);
      dmg = overkillDamage;

      if (!damagedUnit) {
        updatedUnits.splice(unitIdx, 1, UNITS[0]);
      }
      if (damagedUnit) {
        updatedUnits.splice(unitIdx, 1, damagedUnit);
        break;
      }
    }

    return { updatedUnits: updatedUnits, excessDamage: dmg };
  };

  const battleUnitArrays = (playerUnits, computerUnits) => {
    // array = [{unit},{unit},{unit},{unit},{unit}]
    let _playerUnits = [...playerUnits];
    let _computerUnits = [...computerUnits];

    /* 
    
    This logic is shakey, 
    due to choosing opposing units at the same time, _cUnit can be dead by the time
    we use it to follow up attack, we need to re-grab the unit from the damaged updatedArray
    if it doesnt exist we need to handle that.]#


    otherwise all combat working as intended.

    */

    for (let i = 0; i < ROWS; i++) {
      const pUnit = _playerUnits[i];
      const cUnit = _computerUnits[i];
      let damageToPlayerHealth = 0;
      let damageToComputerHealth = 0;
      if (pUnit) {
        const { updatedUnits, excessDamage } = damageUnits(
          pUnit.damage,
          _computerUnits
        );
        damageToComputerHealth = excessDamage;
        _computerUnits = updatedUnits;
      }
      if (cUnit) {
        // check if unit survived?
        const { updatedUnits, excessDamage } = damageUnits(
          cUnit.damage,
          _playerUnits
        );
        damageToPlayerHealth = excessDamage;
        _playerUnits = updatedUnits;
      }

      // we damage health incrementally to allow animations later
      if (damageToComputerHealth)
        computer.health = computer.health - damageToComputerHealth;
      if (damageToPlayerHealth)
        player.health = player.health - damageToPlayerHealth;
    }
    return {
      updatedPlayerCol: _playerUnits,
      updatedComputerCol: _computerUnits,
    };
  };

  /* 
  
  p: 
   tank 2


  comp:
    sandbag 0

  */

  const startCombat = () => {
    const pUnitMatrix = [...playerUnitMatrix];
    const cUnitMatrix = computerUnitMatrix.map((col) => col.reverse());

    for (let col = 0; col < COLS; col++) {
      const { updatedPlayerCol, updatedComputerCol } = battleUnitArrays(
        pUnitMatrix[col],
        cUnitMatrix[col]
      );
      pUnitMatrix.splice(col, 1, updatedPlayerCol);
      cUnitMatrix.splice(col, 1, updatedComputerCol);
    }
    setPlayerUnitMatrix(pUnitMatrix);
    setComputerUnitMatrix(cUnitMatrix.map((col) => col.reverse()));
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
            unit={targetMatrix[colIdx][rowIdx]}
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

  const getRandomEmptySpace = (matrix) => {
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
        getRandomEmptySpace(_computerUnitMatrix);
      if (isSpace) {
        _computerUnitMatrix[columnArrayIndex].splice(availableIndex, 1, {
          ...UNITS[unitId],
          placeInQueue: computer.unitCount,
        });
        computer.unitCount = computer.unitCount + 1;
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
