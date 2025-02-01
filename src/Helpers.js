import { PILES } from "./constants";

// Helper function to determine
export function isRoyal(card) {
  return card.value > 10;
}

export function getPileCards(pileID) {
  return PILES[pileID].cards;
}

export function getTopCard(pileID) {
  return PILES[pileID].cards.slice(0, 1)[0];
}
/** @param {import("./constants").MO52Card[]} cards  */

export function getRoyalCard(cards) {
  return cards.find((card) => isRoyal(card));
}
