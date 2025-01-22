import { PILES, replacePiles } from "./Initializers";
import { renderCards } from "./Renderers";

// Function to create commandManagers, should be one per game to manage history (undo/redo)
export const createCommandManager = () => {
  /** @type {{prevPile: import("./Initializers").Piles, nextPile: import("./Initializers").Piles}[]} */
  // @ts-ignore
  let history = [null];
  let position = 0;

  return {
    /**
     * @param {string} fromPile
     * @param {string} toPile
     */
    doShift(fromPile, toPile) {
      // If current position is anywhere other than the end of the history array, keep only the past history
      if (position < history.length - 1) {
        history = history.slice(0, position + 1);
      }

      // Make a clone of the state before shifting
      const prevPile = structuredClone(PILES);

      // Do the shift
      shiftCards(fromPile, toPile);

      // Make a clone of the state after shifting
      const nextPile = structuredClone(PILES);

      // Save the states to history
      history.push({ prevPile, nextPile });
      position += 1;

      // Finally, do a render
      renderCards();
    },

    undo() {
      // Check if at beginning of history (no undo state to undo to)
      if (position > 0) {
        // Get the previous history
        const { prevPile } = history[position];

        // Shift the history position back one
        position -= 1;

        // Replace the current PILES with the previous state
        replacePiles(prevPile);
      }

      // Finally, do a render
      renderCards();
    },

    redo() {
      // Check if at end of history (no redo state to redo to)
      if (position < history.length - 1) {
        // Increase the history position by one
        position += 1;

        // Get the prior state
        const { nextPile } = history[position];

        // Replace the current state with the next one
        replacePiles(nextPile);
      }

      // Finally, do a render
      renderCards();
    },
  };
};
/**
 * @param {string} fromPile
 * @param {string} toPile
 */

export function shiftCards(fromPile, toPile) {
  // get top card from origin pile
  const topCard = PILES[fromPile].cards.shift();

  // if card found, process it (if needed), then add it to destination pile and reveal next top card
  if (topCard) {
    // If top card is an Ace or Joker, move the whole "to" pile to the bottom of the draw pile before moving the top card
    if (topCard.nameRank === "Ace" || topCard.nameRank === "Joker") {
      const cards = PILES[toPile].cards.splice(0);
      PILES.e5.cards.push(...cards);
    }

    // get next top card and reveal it (if there is one)
    if (PILES[fromPile].cards.length) PILES[fromPile].cards[0].facingDown = false;

    PILES[toPile].cards.unshift(topCard);
  }
}
