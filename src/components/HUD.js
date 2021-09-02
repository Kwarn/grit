import React from "react";
import { UNITS, UNIT_STYLES } from "../unitData";
import styled from "styled-components";

const StyledHUDWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto auto 50px auto;
`;

const StyledHUDContainer = styled.div`
  position: relative;
  color: white;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: auto;
  h2 {
    margin: auto;
  }
  p {
    margin: auto;
  }
`;
const StyledSelectableUnitsContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: black;
  width: 100%;
  height: 100px;
  h2 {
  }
`;
const StyledSelectableUnit = styled.div`
  position: relative;
  border: ${(props) =>
    props.isSelected ? "3px solid green" : "3px solid #474747"};
  background-image: ${(props) =>
    props.isUnlocked ? `url(${UNIT_STYLES[props.unitId]})` : "white"};
  background-size: cover;
  background-position: top;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  width: 100px;
  height: 100px;
  }

  p {
    font-size: 15px;
    color: white;
    margin: auto;
  }
`;
const StyledUnitCost = styled.div`
  position: absolute;
  top: 70px;
  right: 60px;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  h1 {
    width: 40px;
    height: 40px;
    text-align: center;
    font-size: 25px;
    color: black;
    border-radius: 50%;
    background-color: yellow;
    /* border: 4px solid orange; */
  }
`;

const StyledUnitHealth = styled.div`
  position: absolute;
  top: 25px;
  left: -50px;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  h1 {
    margin: auto;
    text-align: center;
    font-size: 22px;
    color: black;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: green;
    /* border: 4px solid green; */
  }
`;

const StyledUnitDamage = styled.div`
  position: absolute;
  top: -5px;
  left: -50px;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  h1 {
    margin: auto;
    text-align: center;
    font-size: 22px;
    color: black;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: red;
    /* border: 4px solid red; */
  }
`;

const StyledUnitName = styled.div`
  position: absolute;
  bottom: -30px;
  left: -3px;
  margin: auto;
  text-align: center;
  height: 35px;
  width: 106px;
  h1 {
    margin: auto 2px;
    height: 25px;
    font-size: 18px;
    color: white;
    text-align: right;

    border-radius: 0px;
    background-color: #474747;
  }
`;

const StyledGoldCount = styled.div`
  margin: 50px auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  left: calc(50% - 50px);
  background-color: yellow;
  margin-bottom: 50px;
  display: flex;
  h1 {
    font-size: 56px;
    margin: auto;
    text-align: center;
    color: black;
  }
`;

const StyledPlayerHealthBar = styled.div`
  position: relative;
  margin: 30px auto;
  min-width: 800px;
  min-height: 30px;
  border-radius: 50px;
  background-color: grey;
  display: flex;
  h1 {
    position: absolute;
    width: 30px;
    top: 3px;
    left: calc(50% - 15px);
    margin: auto;
    padding: 0;
    font-size: 20px;
  }
`;

const StyledPlayerHealthBarFill = styled.div`
  margin: auto auto auto 0;
  transition: width 2s ease-in-out;
  width: ${(props) => `${Math.floor((props.health / 30) * 100)}%`};
  min-height: 30px;
  border-radius: 50px;
  background-color: green;
`;

export default function HUD({ health, gold, selectedUnit, setSelectedUnitCb }) {
  console.log(`health / 30 * 100`, (26 / 30) * 100);
  const selectUnitCards = Object.keys(UNITS).map((key) => {
    if (+key !== 0) {
      const isUnlocked = gold >= UNITS[key].cost;
      return (
        <StyledSelectableUnit
          key={`choice ${key}`}
          isSelected={selectedUnit === key}
          onClick={() => (isUnlocked ? setSelectedUnitCb(key) : null)}
          unitId={key}
          isUnlocked={isUnlocked}
        >
          <StyledUnitName>
            <h1>{UNITS[key].name}</h1>
          </StyledUnitName>
          <StyledUnitHealth>
            <h1>{UNITS[key].health}</h1>
          </StyledUnitHealth>
          <StyledUnitDamage>
            <h1>{UNITS[key].damage}</h1>
          </StyledUnitDamage>
          <StyledUnitCost>
            <h1>{UNITS[key].cost}</h1>
          </StyledUnitCost>
        </StyledSelectableUnit>
      );
    }
  });
  return (
    <StyledHUDWrapper>
      <StyledHUDContainer>
        <StyledPlayerHealthBar>
          <h1>{health}</h1>
          <StyledPlayerHealthBarFill health={health} />
        </StyledPlayerHealthBar>
        <StyledSelectableUnitsContainer>
          {selectUnitCards}
        </StyledSelectableUnitsContainer>
        <StyledGoldCount>
          <h1>{gold}</h1>
        </StyledGoldCount>
      </StyledHUDContainer>
    </StyledHUDWrapper>
  );
}
