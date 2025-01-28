import { OuterPileIds, PILES, InnerPileIds, isRoyal, suitColor, NearestInnerPile } from "./Initializers";

// Counts up value of pile's cards, used for royal piles
function getPileValue(/** @type {import("./Initializers").MO52Card[]} */ pileCards) {
  return pileCards.reduce((acc, card) => {
    return (acc += card.value);
  }, 0);
}

// Checks if a royal card is present and face-down
/** @param {import("./Initializers").MO52Card[]} pileCards */
function checkIfRoyalDefeated(pileCards) {
  return pileCards.some((card) => isRoyal(card) && card.facingDown);
}

// Determines which piles are 'legal' targets for drag and drop
/** @param {import("./Initializers").MO52Card} card */
export function getValidPiles(card) {
  let validPiles;

  // If a Royal, get just valid Royal piles
  if (isRoyal(card)) {
    return getValidRoyalPiles(card);
  } else {
    // Otherwise, check if there are any valid inner piles
    validPiles = getValidInnerPiles(card);
    // Lastly, if no valid inner piles, check outer piles
    return validPiles.length ? validPiles : getValidOuterPiles(card);
  }
}

/**
 * @typedef {{pileID: string, neighborValue: number, matchType: string}} PileMatch
 */

// Function to ascertain where a Royal card can move to
/**
 * @param {import("./Initializers").MO52Card} card
 * @returns {string[]}
 */
function getValidRoyalPiles(card) {
  let validPileMatches = getRoyalPileMatches(card);

  const order = { suit: 0, color: 1, extra: 2 };
  validPileMatches = validPileMatches
    // Sorts by above order, so suit matches come first, then color, etc.
    .sort((a, b) => {
      return order[a.matchType] - order[b.matchType];
    })
    .reduce((acc, match) => {
      // Init acc if empty
      if (!acc[0]) {
        acc.push(match);
        return acc;
      }

      // If same type and value, push onto acc
      if (acc[0].matchType === match.matchType && acc[0].neighborValue === match.neighborValue) acc.push(match);

      // If same type but match has higher value, replace acc
      if (acc[0].matchType === match.matchType && acc[0].neighborValue < match.neighborValue) acc = [match];

      return acc;
    }, /** @type {PileMatch[]} */ ([]));

  return validPileMatches.map((match) => match.pileID);
}

// Function to determine possible matches and match types for Royals to move to
/** @param {import("./Initializers").MO52Card} card */
function getRoyalPileMatches(card) {
  let validPileMatches = /** @type PileMatch[] */ ([]);

  // Reduce OuterPileIds into validPileMatches
  validPileMatches = OuterPileIds.reduce((acc, pileID) => {
    // Return early if outer pile not empty (aka not a valid pile)
    if (PILES[pileID].cards.length !== 0) return acc;

    // Get the nearest neighbor's top card
    const neighborPile = NearestInnerPile[pileID];
    const topNeighbor = PILES[neighborPile].cards.slice(0, 1)[0];

    // First, check if the current pile makes a suit match with its nearest neighbor
    const suitMatch = getSuitMatch(pileID, topNeighbor, card);
    suitMatch && acc.push(suitMatch);
    if (!suitMatch) {
      // If not a suit match, check for color match
      const colorMatch = getColorMatch(pileID, topNeighbor, card);
      colorMatch && acc.push(colorMatch);
      if (!colorMatch) {
        // If not a suit or color match, then it's an 'extra' match
        acc.push({ pileID, neighborValue: topNeighbor.value, matchType: "extra" });
      }
    }

    return acc;
  }, /** @type PileMatch[] */ ([]));
  return validPileMatches;
}

// Function to check if there is a suit match for the provided pile and card
/**
 * @param {string} pileID
 * @param {import("./Initializers").MO52Card} topNeighbor
 * @param {import("./Initializers").MO52Card} card
 * @returns {PileMatch | null}
 */
function getSuitMatch(pileID, topNeighbor, card) {
  const neighborSuit = topNeighbor.suit;
  const neighborValue = topNeighbor.value;
  return neighborSuit === card.suit ? { pileID, neighborValue, matchType: "suit" } : null;
}

// Function to check if there is a color match for the provided pile and card
/**
 * @param {string} pileID
 * @param {import("./Initializers").MO52Card} topNeighbor
 * @param {import("./Initializers").MO52Card} card
 * @returns {PileMatch | null}
 */
function getColorMatch(pileID, topNeighbor, card) {
  const neighborSuit = topNeighbor.suit;
  const neighborColor = suitColor[neighborSuit];
  const neighborValue = topNeighbor.value;
  return neighborColor === suitColor[card.suit] ? { pileID, neighborValue, matchType: "color" } : null;
}

// Function to check which outer piles might be valid for a given card
// FIXME: Rewrite this function to account for non-royals only
/** @param {import("./Initializers").MO52Card} card */
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

// Function to check which inner piles might be valid for a given card
/** @param {import("./Initializers").MO52Card} card */
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

// Checks if the toPile is valid for the top card of the fromPile
/**
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
