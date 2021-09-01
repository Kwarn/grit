import styled from "styled-components";
import { UNITS, UNIT_STYLES } from "../UnitValues";

export const AppWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  display: flex;
`;

export const BoardWrapper = styled.div`
  margin: auto;
  width: 840px;
  height: auto;
  background-color: black;
  display: flex;
  flex-direction: column;
`;

export const BoardGridTop = styled.div`
  padding: 10px;
  margin: 10px auto auto auto;
  width: 800px;
  height: 600px;
  display: grid;
  background-color: black;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 10px 10px;
`;

export const BoardGridBottom = styled.div`
  padding: 10px;
  margin: auto auto 10px auto;
  width: 800px;
  height: 600px;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 10px 10px;
`;

export const TopHudWrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto auto 50px auto;
`;

export const Player1Hud = styled.div`
  color: white;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 300px;
  height: 100px;
  h2 {
    margin: auto;
  }
  p {
    margin: auto;
  }
`;

export const UnitContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: black;
  width: 500px;
  height: 100px;
  h2 {
  }
`;

export const Unit = styled.div`
  position: relative;
  border: ${(props) =>
    props.isSelected ? "3px solid green" : "3px solid transparent"};
  background-image: ${(props) =>
    props.isUnlocked ? `url(${UNIT_STYLES[props.unitId]})` : "white"};
  background-size: cover;
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 80px;
  height: 80px;
  div {
    position: absolute;
    bottom: -50px;
  }
  p {
    font-size: 10px;
    color: white;
    margin: auto;
  }
`;

export const RoundTimer = styled.div`
  background-color: black;
  min-width: 800px;
  min-height: 100px;
  display: flex;
  justify-content: center;
`;
