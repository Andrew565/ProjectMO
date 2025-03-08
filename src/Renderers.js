import { PILES, InnerPileIds, suitColor } from "./constants";

// Get card templates for making cards
export const faceUpTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("faceUpCardTemplate"));
export const faceDownTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("faceDownCardTemplate"));
export const emptyTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("emptyCardTemplate"));

/**
 * @param {import("./constants").MO52Card} chosenCard
 * @param {number} index
 */
function makeFaceUpCard(chosenCard, index) {
  // Clone Template
  const faceUpCard = /** @type {HTMLElement} */ (faceUpTemplate?.content.cloneNode(true));

  // Get main element and add index to it
  const cardEl = faceUpCard.querySelector(".mo-card");
  if (cardEl) {
    cardEl.setAttribute("style", `--index: ${index}`);
  }

  // Helper function to set the innerHTML value for an element
  /**
   * @param {HTMLElement} cardEl
   * @param {string} selector
   * @param {string} value
   */
  function setElInnerHTML(cardEl, selector, value) {
    const selectedEl = cardEl.querySelector(selector);
    if (selectedEl) selectedEl.innerHTML = value;
  }

  // Set card's rank, suit, and name
  setElInnerHTML(faceUpCard, ".mo-card__rank", chosenCard.initial);
  setElInnerHTML(faceUpCard, ".mo-card__suit", chosenCard.suit);
  setElInnerHTML(faceUpCard, ".mo-card__name", chosenCard.name);

  if (suitColor[chosenCard.suit] === "Red") {
    faceUpCard.querySelector(".mo-card__suit")?.classList.add("red");
  }

  return faceUpCard;
}
/** @param {number} index */
function makeFaceDownCard(index) {
  const faceDownCard = /** @type {HTMLElement} */ (faceDownTemplate?.content.cloneNode(true));
  const fdCardEl = faceDownCard.querySelector(".mo-card");
  if (fdCardEl) fdCardEl.setAttribute("style", `--index: ${index}`);
  return faceDownCard;
}
/** @param {number} index */
function makeEmptyCard(index) {
  const emptyCard = /** @type {HTMLElement} */ (emptyTemplate?.content.cloneNode(true));
  const emptyCardEl = emptyCard.querySelector(".mo-card");
  if (emptyCardEl) emptyCardEl.setAttribute("style", `--index: ${index}`);
  return emptyCard;
}
export function renderCards() {
  Object.entries(PILES).forEach(([pileName, { cards }]) => {
    const cardsClone = Array.from(cards);

    // For each inner pile, render out cards in reverse order, so that [0] ends up with the highest index
    if (InnerPileIds.includes(pileName)) cardsClone.reverse();

    // Make card elements
    const cardEls = cardsClone.map((card, index) => {
      if (card.facingDown) {
        return makeFaceDownCard(index);
      } else {
        // Set the index to 99 for the top card of draw pile
        if (pileName === "e5") index = 99;

        return makeFaceUpCard(card, index);
      }
    });

    // Add an empty card to the bottom of the pile (makes drag n drop easier)
    const nextIndex = cardEls.length;
    const emptyCard = makeEmptyCard(nextIndex);
    cardEls.push(emptyCard);

    // Next, append cards to pile
    const pileEl = document.querySelector(`#${pileName}.pile`);
    pileEl?.replaceChildren(...cardEls);
  });
}
