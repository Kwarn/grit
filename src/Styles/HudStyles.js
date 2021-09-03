import styled from "styled-components";
import { UNITS, UNIT_STYLES } from "../unitData";

export const HUDWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto auto 50px auto;
`;

export const HUDContainer = styled.div`
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
export const SelectableUnitsContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: black;
  width: 100%;
  height: 100px;
  h2 {
  }
`;
export const SelectableUnit = styled.div`
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
  p {
    font-size: 15px;
    color: white;
    margin: auto;
  }
`;

export const UnitCost = styled.div`
  position: absolute;
  top: 75px;
  right: 50px;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  h1 {
    width: 30px;
    height: 30px;
    text-align: center;
    font-size: 25px;
    color: black;
    border-radius: 50%;
    background-color: yellow;
    /* border: 4px solid orange; */
  }
`;

export const UnitHealth = styled.div`
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

export const UnitDamage = styled.div`
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

export const UnitName = styled.div`
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

export const GoldCount = styled.div`
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

export const HealthBar = styled.div`
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

export const HealthBarFill = styled.div`
  margin: auto auto auto 0;
  transition: width 2s ease-in-out;
  width: ${(props) => `${props.percent}%`};
  min-height: 30px;
  border-radius: 50px;
  background-color: green;
`;
