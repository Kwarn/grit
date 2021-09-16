import React, { useState, useEffect } from "react";
import { UNITS } from "./unitData";
import ProgressBar from "./components/ProgressBar";
import SingleUnit from "./components/SingleUnit";
import * as styles from "./Styles/AppStyles";
import HUD from "./components/HUD";

const COLS = 6;
const ROWS = 5;
// const player = { health: 30, gold: 25 };
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

      at the moment clicking space in computer row places selected unit 
      in player row in the same column/row (not opposite), undecided if this should be kept.

      to time animations we need to update each unit individually

      We may need 2 setIntervals, one to do attacks & damage and
      one to stop attacking & remove/apply damage to defending unit

    TODO:

      improve unit selection and placement for AI, sandbags closer & helicopters further back
      seperate logic into different files as it's getting hard to read
      lock actions during combat phase
      
    

*/

function App() {
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const [computersTurn, setComputersTurn] = useState(true);
  const [playerUnitElements, setPlayerUnitElements] = useState([]);
  const [computerUnitElements, setComputerUnitElements] = useState([]);
  const [player, setPlayer] = useState({ health: 30, gold: 25 });
  const [computer, setComputer] = useState({ health: 30, gold: 25 });

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

  const damageHealthBar = (damage, target) => {
    target === "player"
      ? setPlayer((prev) => ({ ...prev, health: prev.health - damage }))
      : setComputer((prev) => ({ ...prev, health: prev.health - damage }));
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

  const damageUnits = (
    attackerIdentifier,
    defenderIdentifier,
    attackerIdx,
    damage,
    defenderUnitArray
  ) => {
    const attackOrder = [];
    let updatedUnits = [...defenderUnitArray];
    let defenderIdx = 0;
    let dmg = damage;

    while (dmg && defenderIdx < ROWS) {
      const unit = updatedUnits[defenderIdx];
      if (unit.id === 0) {
        defenderIdx += 1;
        continue;
      }
      attackOrder.push({
        attacker: attackerIdentifier,
        defender: defenderIdentifier,
        attackerIdx: attackerIdx,
        defenderIdx: defenderIdx,
      });
      const { damagedUnit, overkillDamage } = damageUnit(dmg, unit);
      dmg = overkillDamage;

      if (!damagedUnit) {
        updatedUnits.splice(defenderIdx, 1, UNITS[0]);
      }
      if (damagedUnit) {
        updatedUnits.splice(defenderIdx, 1, damagedUnit);
        break;
      }
    }

    if (dmg) {
      attackOrder.push({
        damageToHealth: dmg,
        defenderIdentifier: defenderIdentifier,
        attackerIdentifier: attackerIdentifier,
        attackerIdx: attackerIdx,
      });
    }
    return {
      updatedUnits: updatedUnits,
      attackOrder: attackOrder,
    };
  };

  const battleUnitArrays = (playerUnits, computerUnits) => {
    let _playerUnits = [...playerUnits];
    let _computerUnits = [...computerUnits];
    const atkOrder = [];

    for (let i = 0; i < ROWS; i++) {
      const pUnit = _playerUnits[i];
      if (pUnit.id !== 0) {
        const { updatedUnits, attackOrder } = damageUnits(
          "player",
          "computer",
          i,
          pUnit.damage,
          _computerUnits
        );
        atkOrder.push(...attackOrder);
        _computerUnits = updatedUnits;
      }

      const cUnit = _computerUnits[i];
      if (cUnit.id !== 0) {
        const { updatedUnits, attackOrder } = damageUnits(
          "computer",
          "player",
          i,
          cUnit.damage,
          _playerUnits
        );
        atkOrder.push(...attackOrder);
        _playerUnits = updatedUnits;
      }
    }
    return {
      updatedPlayerCol: _playerUnits,
      updatedComputerCol: _computerUnits,
      atkOrder: atkOrder,
    };
  };

  const startCombat = () => {
    const updatedPlayerMatrix = [...playerUnitMatrix];
    const updatedComputerMatrix = computerUnitMatrix.map((col) =>
      col.reverse()
    );
    const finalAttackOrder = [];

    for (let col = 0; col < COLS; col++) {
      const { updatedPlayerCol, updatedComputerCol, atkOrder } =
        battleUnitArrays(updatedPlayerMatrix[col], updatedComputerMatrix[col]);
      updatedPlayerMatrix.splice(col, 1, updatedPlayerCol);
      updatedComputerMatrix.splice(col, 1, updatedComputerCol);
      finalAttackOrder.push(
        ...atkOrder.map((order) => ({ ...order, col: col }))
      );
    }

    let index = 0;
    const incrementalMatrixUpdate = () => {
      if (index === finalAttackOrder.length) {
        return clearInterval(attackQueue);
      }
      const {
        attackerIdentifier,
        defenderIdentifier,
        attackerIdx,
        defenderIdx,
        col,
        damageToHealth,
        healthBarTarget,
      } = finalAttackOrder[index];

      let attackingMatrix = [];
      let defendingMatrix = [];
      let setAttackingMatrix = null;
      let setDefendingMatrix = null;

      if (attackerIdentifier === "player") {
        attackingMatrix = playerUnitMatrix;
        setAttackingMatrix = setPlayerUnitMatrix;
      } else {
        attackingMatrix = computerUnitMatrix;
        setAttackingMatrix = setComputerUnitMatrix;
      }
      // Fix this: reversing is switching units around
      setAttackingMatrix((prev) => {
        const newMatrix = prev.map((col) => col.reverse());
        newMatrix[col][attackerIdx].isAttacking = true;
        return newMatrix.map((col) => col.reverse());
      });

      if (damageToHealth) {
        damageHealthBar(damageToHealth, defenderIdentifier);
        index += 1;
        return;
      }
      index += 1;
    };

    const attackQueue = setInterval(() => incrementalMatrixUpdate(), [500]);
  };

  const startRoundHandler = () => {
    setRoundStarted(true);
    startCombat();
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
      setPlayer((prev) => ({
        ...prev,
        gold: prev.gold - UNITS[selectedUnit].cost,
      }));
    }
  };

  /*                          COMPUTER LOGIC                       */

  const randomIntExclusiveMax = (min, max) =>
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
        });
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
