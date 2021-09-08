import React from "react";
import styled from "styled-components";
import { UNIT_STYLES, UNITS } from "../unitData";

const StyledSingleUnit = styled.div`
  margin: auto;
  background-image: ${(props) => `url(${UNIT_STYLES[props.unitId]})`};
  background-size: cover;
  width: 100%;
  height: 100%;
  grid-row: ${(props) => `${props.gridRow} / ${props.gridRow + 1}`};
  grid-column: ${(props) => `${props.gridCol} / ${props.gridCol + 1}`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  p {
    margin: 0 auto auto 0;
    font-size: 10px;
  }
  h3 {
    margin: auto auto 5px auto;
    font-size: 20px;
  }
  h2 {
    margin: auto auto;
    font-size: 14px;
  }
`;

const StyledUnitHealth = styled.div`
  color: white;
  background-color: green;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  p {
    font-size: 20px;
    margin: auto;
    text-align: center;
  }
`;

const StyledUnitDamage = styled.div`
  color: white;
  background-color: red;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  p {
    font-size: 20px;
    margin: auto;
    text-align: center;
  }
`;

export default function SingleUnit({ colIdx, rowIdx, changeUnitCb, unit }) {
  return (
    <StyledSingleUnit
      gridCol={colIdx + 1}
      gridRow={rowIdx + 1}
      onClick={() => changeUnitCb(colIdx, rowIdx)}
      unitId={unit.id}
    >
      <p>
        {colIdx}-{rowIdx}
      </p>
      {unit.damage ? (
        <StyledUnitDamage>
          <p>{unit.damage}</p>
        </StyledUnitDamage>
      ) : null}
      {unit.health ? (
        <StyledUnitHealth>
          <p>{unit.health}</p>
        </StyledUnitHealth>
      ) : null}
    </StyledSingleUnit>
  );
}
