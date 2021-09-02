import React from "react";
import { UNITS, UNIT_STYLES } from "../unitData";
import styled from "styled-components";
import * as styles from "../Styles/HudStyles";

export default function HUD({ health, gold, selectedUnit, setSelectedUnitCb }) {
  console.log(`health / 30 * 100`, (26 / 30) * 100);
  const selectUnitCards = Object.keys(UNITS).map((key) => {
    if (+key !== 0) {
      const isUnlocked = gold >= UNITS[key].cost;
      return (
        <styles.SelectableUnit
          key={`choice ${key}`}
          isSelected={selectedUnit === key}
          onClick={() => (isUnlocked ? setSelectedUnitCb(key) : null)}
          unitId={key}
          isUnlocked={isUnlocked}
        >
          <styles.UnitName>
            <h1>{UNITS[key].name}</h1>
          </styles.UnitName>
          <styles.UnitHealth>
            <h1>{UNITS[key].health}</h1>
          </styles.UnitHealth>
          <styles.UnitDamage>
            <h1>{UNITS[key].damage}</h1>
          </styles.UnitDamage>
          <styles.UnitCost>
            <h1>{UNITS[key].cost}</h1>
          </styles.UnitCost>
        </styles.SelectableUnit>
      );
    }
  });
  return (
    <styles.HUDWrapper>
      <styles.HUDContainer>
        <styles.PlayerHealthBar>
          <h1>{health}</h1>
          <styles.PlayerHealthBarFill health={health} />
        </styles.PlayerHealthBar>
        <styles.SelectableUnitsContainer>
          {selectUnitCards}
        </styles.SelectableUnitsContainer>
        <styles.GoldCount>
          <h1>{gold}</h1>
        </styles.GoldCount>
      </styles.HUDContainer>
    </styles.HUDWrapper>
  );
}
