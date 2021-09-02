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

export default function SingleUnit({ colIdx, rowIdx, changeUnitCb, unitId }) {
  return (
    <StyledSingleUnit
      gridCol={colIdx + 1}
      gridRow={rowIdx + 1}
      onClick={() => changeUnitCb(colIdx, rowIdx)}
      unitId={unitId}
    >
      <p>
        {colIdx}-{rowIdx}
      </p>
      {UNITS[unitId].health ? <h3>HP:{UNITS[unitId].health}</h3> : null}
    </StyledSingleUnit>
  );
}
