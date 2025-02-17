import { isRoyal } from "./Helpers";
import { PILES, moDeck, InnerPileIds } from "./constants";

export function collectAndShuffleCards() {
  Object.entries(PILES).forEach(([pileId, { cards }]) => {
    if (pileId !== "e5") {
      const pileCards = cards.splice(0);
      pileCards.forEach((card) => (card.facingDown = true));
      moDeck.addToDrawPile(pileCards);
    }
  });

  // Shuffle cards
  moDeck.shuffle(3);
}

export function dealOutInitialCards() {
  let allPilesDealt = false;
  let royals = [];
  const innerPilesList = Array.from(InnerPileIds);

  while (!allPilesDealt) {
    const card = moDeck.drawFromDrawPile(1)[0];
    card.facingDown = false;

    // If Royal, set aside
    if (isRoyal(card)) {
      card.facingDown = true;
      royals.push(card);
    } else {
      // Else, deal to an empty center pile that isn't c3
      const currentPile = innerPilesList.shift();
      // Skip the center pile
      if (currentPile && currentPile !== "c3") {
        PILES[currentPile].cards.push(card);
      }
    }

    if (innerPilesList.length === 0) {
      allPilesDealt = true;
    }
  }

  // Add Royals (if any) back to top of draw pile
  moDeck.addToTopOfDrawPile(royals);
  // Flip over top draw pile card
  moDeck.drawPile[0].facingDown = false;
} /** @param {import("./Initializers").MO52Card} card */
