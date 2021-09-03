import React from "react";
import { UNITS, UNIT_STYLES } from "../unitData";
import styled from "styled-components";
import * as styles from "../Styles/HudStyles";

const MAX_HP = 30;

export default function HUD({ health, gold, selectedUnit, setSelectedUnitCb }) {
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
        <styles.HealthBar>
          <h1>{health}</h1>
          <styles.HealthBarFill percent={Math.floor((health / MAX_HP) * 100)} />
        </styles.HealthBar>
        {setSelectedUnitCb ? (
          <>
            <styles.SelectableUnitsContainer>
              {selectUnitCards}
            </styles.SelectableUnitsContainer>
            <styles.GoldCount>
              <h1>{gold}</h1>
            </styles.GoldCount>
          </>
        ) : null}
      </styles.HUDContainer>
    </styles.HUDWrapper>
  );
}
