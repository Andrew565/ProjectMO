import { OuterPileIds, PILES, InnerPileIds, isRoyal } from "./Initializers";

// Counts up value of pile's cards, used for royal piles
function getPileValue(/** @type {import("./Initializers").MO52Card[]} */ pileCards) {
  return pileCards.reduce((acc, card) => {
    return (acc += card.value);
  }, 0);
}
/**
 * Checks if a royal card is present and face-down
 * @param {import("./Initializers").MO52Card[]} pileCards
 */
function checkIfRoyalDefeated(pileCards) {
  return pileCards.some((card) => isRoyal(card) && card.facingDown);
}
/**
 * Determines which piles are 'legal' targets for drag and drop
 * @param {import("./Initializers").MO52Card} card
 */
export function getValidPiles(card) {
  let validOuterIds;

  // If a Royal, skip the inner IDs
  if (isRoyal(card)) {
    validOuterIds = getValidOuterPiles(card);
    return validOuterIds.length ? validOuterIds : [];
  }

  return getValidInnerPiles(card);
}
/**
 * Function to check which outer piles might be valid for a given card
 * @param {import("./Initializers").MO52Card} card
 */
function getValidOuterPiles(card) {
  return OuterPileIds.reduce((acc, pileId) => {
    const pileCards = /** @type {import("./Initializers").MO52Card[]} */ (PILES[pileId].cards).slice(0);

    // Check if empty
    if (!pileCards) {
      acc.push(pileId);
    }

    // If there's a royal, check that the royal hasn't already been defeated
    if (checkIfRoyalDefeated(pileCards)) {
      return acc;
    }

    // Check that the total value won't exceed 21
    const pileValue = getPileValue(pileCards);
    if (pileValue + card.value < 21) {
      acc.push(pileId);
    }

    return acc;
  }, /** @type {string[]} */ ([]));
}
/**
 * Function to check which inner piles might be valid for a given card
 * @param {import("./Initializers").MO52Card} card
 */
function getValidInnerPiles(card) {
  return InnerPileIds.reduce((acc, pileId) => {
    // If an Ace or Joker, add the pileId and return early
    if (card.value <= 1) {
      acc.push(pileId);
    } else {
      // Get top card, if any
      const topPileCard = /** @type {import("./Initializers").MO52Card[]} */ (PILES[pileId].cards).slice(0)[0];

      // Check if topPileCard is same or lower value, or if pile is empty
      if ((topPileCard && topPileCard.value <= card.value) || !topPileCard) {
        acc.push(pileId);
      }
    }

    return acc;
  }, /** @type {string[]} */ ([]));
}
/**
 * Checks if the toPile is a valid location for the top card of the fromPile
 * @param {string} fromPile
 * @param {string} toPile
 * @returns {boolean}
 */
export function isValidPile(fromPile, toPile) {
  const card = PILES[fromPile].cards.slice(0)[0];
  const validPiles = getValidPiles(card);
  const retVal = validPiles.includes(toPile);
  return retVal;
}
