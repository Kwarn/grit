import styled from "styled-components";
import { UNITS, UNIT_STYLES } from "../unitData";

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

export const PlayerGrid = styled.div`
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

export const ComputerGrid = styled.div`
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

export const RoundTimer = styled.div`
  background-color: black;
  min-width: 800px;
  min-height: 100px;
  display: flex;
  justify-content: center;
`;

export const BottomHudWrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto auto 50px auto;
`;

export const ComputerHud = styled.div`
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
