import grass from "./assets/grass.png";
import blank from "./assets/blank.png";
import soldier from "./assets/soldier.png";
import tank from "./assets/tank.png";
import turret from "./assets/turret.png";
import sandbags from "./assets/sandbags.png";
import helicopter from "./assets/helicopter.png";

export const UNIT_STYLES = {
  0: blank,
  1: sandbags,
  2: soldier,
  3: turret,
  4: tank,
  5: helicopter,
};

export const UNITS = {
  0: { id: 0, name: "Space", health: 0, damage: 0, cost: 0 },
  1: {
    id: 1,
    name: "Sand Bags",
    health: 4,
    damage: 0,
    cost: 2,
    placeInQueue: 0,
  },
  2: { id: 2, name: "Soldier", health: 1, damage: 2, cost: 3 },
  3: { id: 3, name: "Turret", health: 2, damage: 6, cost: 5 },
  4: { id: 4, name: "Tank", health: 8, damage: 4, cost: 8 },
  5: { id: 5, name: "Heli", health: 2, damage: 6, cost: 10 },
};
