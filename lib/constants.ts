/**
 * Cosmic facts and physics constants for the "Right Now" dashboard.
 * All values are approximate; used for playful, over-informative context.
 */

export const COSMIC_FACTS = {
  planet: "Earth",
  planetPosition: "3rd from the Sun",
  star: "Sun (G-type main-sequence)",
  starSystem: "Solar System",
  galaxy: "Milky Way (barred spiral)",
  localGroup: "Local Group",
  supercluster: "Laniakea Supercluster",
  observableUniverse: "Yes",
} as const;

/** Approximate values in SI or common units. */
export const PHYSICS_CONSTANTS = {
  /** Earth orbital speed around the Sun, km/s */
  earthOrbitalSpeedKmPerS: 29.78,
  /** Earth rotation speed at equator, m/s */
  earthRotationSpeedEquatorMetersPerS: 465,
  /** Average distance to Sun, km */
  distanceToSunKm: 149_597_870,
  /** Average distance to Moon, km */
  distanceToMoonKm: 384_400,
  /** Distance to galactic center, light-years (approx) */
  distanceToGalacticCenterLy: 26_000,
  /** Age of the universe, years (approx) */
  ageOfUniverseYears: 13.8e9,
} as const;

export const META_FACTS = {
  youAreHere: "Yes",
  isThisMomentUnique: "Yes",
  willItEverRepeat: "No",
  entropyStatus: "Increasing",
  heatDeathOfUniverse: "Not yet",
  madeOfStardust: "Yes",
} as const;
