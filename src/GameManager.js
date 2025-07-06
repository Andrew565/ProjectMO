import { OuterPileIds, RoyalUnits, suitColor } from "./constants";
import { getPileCards, getRoyalCard, getTopCard } from "./Helpers";
import { getValidPiles } from "./Validators";

/**
 * @typedef {(pileIDsToCheck: string[], cardsToBeat: import("./constants").MO52Card[]) => boolean} DefeatCondition
 */

/** @type {{[x: string]: DefeatCondition}} */
const DefeatConditions = {
  // Jack Defeat Condition == total value >= 11 plus armor
  Jack: function (pileIDsToCheck, cardsToBeat) {
    // First get the total value of the cards to check
    const cardsToCheck = pileIDsToCheck.map((pileID) => getTopCard(pileID));
    const cardsToCheckTotal = cardsToCheck.reduce((acc, card) => {
      acc += card?.value || 0;
      return acc;
    }, 0);

    // Then get the total value of the cards to beat
    const cardsToBeatTotal = cardsToBeat.reduce((acc, card) => {
      acc += card.value;
      return acc;
    }, 0);

    // Last, return if the check total is greater than or equal to the beat total
    return cardsToCheckTotal >= cardsToBeatTotal;
  },
  // Queen Defeat Condition == total value of same color is >= 12 plus armor
  Queen: function (pileIDsToCheck, cardsToBeat) {
    // First get the royal pile and the royal card specifically so we can check for the needed color
    const royalCard = getRoyalCard(cardsToBeat);

    // Return false early if there is no royal
    if (!royalCard) return false;

    // Get the needed color for check cards to match
    const neededColor = suitColor[royalCard.suit];

    // Get the total value of the cards to beat
    const cardsToBeatTotal = cardsToBeat.reduce((acc, card) => {
      acc += card.value;
      return acc;
    }, 0);

    // Next get the cards to check, filter them, and total their values
    const cardsToCheck = pileIDsToCheck.map((pileID) => getTopCard(pileID));
    const cardsToCheckTotal = cardsToCheck
      .filter((card) => card && suitColor[card.suit] === neededColor)
      .reduce((acc, card) => {
        acc += card?.value || 0;
        return acc;
      }, 0);

    // Last, return if the check total is greater than or equal to the beat total
    return cardsToCheckTotal >= cardsToBeatTotal;
  },
  // King Defeat Condition == total value of same suit is >= 13 plus armor
  King: function (pileIDsToCheck, cardsToBeat) {
    // First get the royal pile and the royal card specifically so we can check for the needed color
    const royalCard = getRoyalCard(cardsToBeat);

    // Return false early if there is no royal
    if (!royalCard) return false;

    // Get the needed color for check cards to match
    const neededSuit = royalCard.suit;

    // Get the total value of the cards to beat
    const cardsToBeatTotal = cardsToBeat.reduce((acc, card) => {
      acc += card.value;
      return acc;
    }, 0);

    // Next get the cards to check, filter them, and total their values
    const cardsToCheck = pileIDsToCheck.map((pileID) => getTopCard(pileID));
    const cardsToCheckTotal = cardsToCheck
      .filter((card) => card && card.suit === neededSuit)
      .reduce((acc, card) => {
        acc += card?.value || 0;
        return acc;
      }, 0);

    // Last, return if the check total is greater than or equal to the beat total
    return cardsToCheckTotal >= cardsToBeatTotal;
  },
};

/**
 * @typedef {{tick: (toPile: string) => void}} GameManager
 */

// Function to create a Game Manager, which will manage game 'ticks' as well as verifying success/defeat scenarios
/** @returns {GameManager} */
export const createGameManager = () => {
  /** @param {string} toPile */
  function checkIfRoyalsDefeated(toPile) {
    // Get the Royal Units for the specified pile
    const unitsToCheck = RoyalUnits[toPile];
    // For each unit, check for its "defeat" condition
    unitsToCheck.forEach((unit) => {
      const royalPile = getPileCards(unit.royalPile);
      const royalCard = getRoyalCard(royalPile);
      if (royalCard) {
        const defeated = DefeatConditions[royalCard.nameRank](unit.cardsToCheck, royalPile);
        if (defeated) {
          // If royal defeated, flip its pile face down
          royalPile.forEach((card) => (card.facingDown = true));
        }
      }
    });
  }

  /** @returns {Boolean} */
  function checkIfGameWon() {
    // Get all of the outer piles and see if all 12 are face-down
    return OuterPileIds.every((pileId) => {
      const cards = getPileCards(pileId);
      return cards.length > 0 && cards.every((card) => card.facingDown);
    });
  }

  let lostReason = "";

  /** @returns {Boolean} */
  function checkIfGameLost() {
    // Get the top card of the draw pile
    const topCard = getTopCard("e5");

    // If no more cards in draw pile then game is lost
    if (!topCard) {
      lostReason = "No more cards in draw pile.";
      return true;
    }

    // If 0 validPiles for top card, then game unwinnable
    if (getValidPiles(topCard).length === 0) {
      lostReason = "No valid place to play card.";
      return true;
    }

    return false;
  }

  let gameWon = false;
  let gameLost = false;

  return {
    tick: (toPile) => {
      // Skip checks if toPile is an Outer pile and there are still cards in the draw pile
      const drawPile = getPileCards("e5");
      if (OuterPileIds.includes(toPile) && drawPile.length) return;

      // Check if any Royals were defeated in the last shift
      checkIfRoyalsDefeated(toPile);

      // Check if the game has been won
      gameWon = checkIfGameWon();
      if (gameWon) {
        console.log("YOU WIN!");
        const gameWonDialog = /** @type {HTMLDialogElement} */ (document.getElementById("gameWonDialog"));
        gameWonDialog.showModal();
        gameWonDialog.querySelector("#gameWonCloseButton")?.addEventListener("click", () => {
          gameWonDialog.close();
        });
        return;
      }

      // Lastly, check if the game has entered a "no win" situation
      gameLost = checkIfGameLost();
      if (gameLost) {
        const gameLostDialog = /** @type {HTMLDialogElement} */ (document.getElementById("gameLostDialog"));
        const gameLostReasonEl = gameLostDialog.querySelector("#gameLostReason");
        if (gameLostReasonEl) gameLostReasonEl.innerHTML = lostReason;
        gameLostDialog.showModal();
        gameLostDialog.querySelector("#gameLostCloseButton")?.addEventListener("click", () => {
          gameLostDialog.close();
        });
      }
    },
  };
};
