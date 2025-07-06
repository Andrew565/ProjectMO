(function () {
  'use strict';

  var n=[{numberRank:0,nameRank:"Two",initial:"2",suit:"Clubs",name:"Two of Clubs"},{numberRank:1,nameRank:"Three",initial:"3",suit:"Clubs",name:"Three of Clubs"},{numberRank:2,nameRank:"Four",initial:"4",suit:"Clubs",name:"Four of Clubs"},{numberRank:3,nameRank:"Five",initial:"5",suit:"Clubs",name:"Five of Clubs"},{numberRank:4,nameRank:"Six",initial:"6",suit:"Clubs",name:"Six of Clubs"},{numberRank:5,nameRank:"Seven",initial:"7",suit:"Clubs",name:"Seven of Clubs"},{numberRank:6,nameRank:"Eight",initial:"8",suit:"Clubs",name:"Eight of Clubs"},{numberRank:7,nameRank:"Nine",initial:"9",suit:"Clubs",name:"Nine of Clubs"},{numberRank:8,nameRank:"Ten",initial:"10",suit:"Clubs",name:"Ten of Clubs"},{numberRank:9,nameRank:"Jack",initial:"J",suit:"Clubs",name:"Jack of Clubs"},{numberRank:10,nameRank:"Queen",initial:"Q",suit:"Clubs",name:"Queen of Clubs"},{numberRank:11,nameRank:"King",initial:"K",suit:"Clubs",name:"King of Clubs"},{numberRank:12,nameRank:"Ace",initial:"A",suit:"Clubs",name:"Ace of Clubs"},{numberRank:0,nameRank:"Two",initial:"2",suit:"Hearts",name:"Two of Hearts"},{numberRank:1,nameRank:"Three",initial:"3",suit:"Hearts",name:"Three of Hearts"},{numberRank:2,nameRank:"Four",initial:"4",suit:"Hearts",name:"Four of Hearts"},{numberRank:3,nameRank:"Five",initial:"5",suit:"Hearts",name:"Five of Hearts"},{numberRank:4,nameRank:"Six",initial:"6",suit:"Hearts",name:"Six of Hearts"},{numberRank:5,nameRank:"Seven",initial:"7",suit:"Hearts",name:"Seven of Hearts"},{numberRank:6,nameRank:"Eight",initial:"8",suit:"Hearts",name:"Eight of Hearts"},{numberRank:7,nameRank:"Nine",initial:"9",suit:"Hearts",name:"Nine of Hearts"},{numberRank:8,nameRank:"Ten",initial:"10",suit:"Hearts",name:"Ten of Hearts"},{numberRank:9,nameRank:"Jack",initial:"J",suit:"Hearts",name:"Jack of Hearts"},{numberRank:10,nameRank:"Queen",initial:"Q",suit:"Hearts",name:"Queen of Hearts"},{numberRank:11,nameRank:"King",initial:"K",suit:"Hearts",name:"King of Hearts"},{numberRank:12,nameRank:"Ace",initial:"A",suit:"Hearts",name:"Ace of Hearts"},{numberRank:0,nameRank:"Two",initial:"2",suit:"Spades",name:"Two of Spades"},{numberRank:1,nameRank:"Three",initial:"3",suit:"Spades",name:"Three of Spades"},{numberRank:2,nameRank:"Four",initial:"4",suit:"Spades",name:"Four of Spades"},{numberRank:3,nameRank:"Five",initial:"5",suit:"Spades",name:"Five of Spades"},{numberRank:4,nameRank:"Six",initial:"6",suit:"Spades",name:"Six of Spades"},{numberRank:5,nameRank:"Seven",initial:"7",suit:"Spades",name:"Seven of Spades"},{numberRank:6,nameRank:"Eight",initial:"8",suit:"Spades",name:"Eight of Spades"},{numberRank:7,nameRank:"Nine",initial:"9",suit:"Spades",name:"Nine of Spades"},{numberRank:8,nameRank:"Ten",initial:"10",suit:"Spades",name:"Ten of Spades"},{numberRank:9,nameRank:"Jack",initial:"J",suit:"Spades",name:"Jack of Spades"},{numberRank:10,nameRank:"Queen",initial:"Q",suit:"Spades",name:"Queen of Spades"},{numberRank:11,nameRank:"King",initial:"K",suit:"Spades",name:"King of Spades"},{numberRank:12,nameRank:"Ace",initial:"A",suit:"Spades",name:"Ace of Spades"},{numberRank:0,nameRank:"Two",initial:"2",suit:"Diamonds",name:"Two of Diamonds"},{numberRank:1,nameRank:"Three",initial:"3",suit:"Diamonds",name:"Three of Diamonds"},{numberRank:2,nameRank:"Four",initial:"4",suit:"Diamonds",name:"Four of Diamonds"},{numberRank:3,nameRank:"Five",initial:"5",suit:"Diamonds",name:"Five of Diamonds"},{numberRank:4,nameRank:"Six",initial:"6",suit:"Diamonds",name:"Six of Diamonds"},{numberRank:5,nameRank:"Seven",initial:"7",suit:"Diamonds",name:"Seven of Diamonds"},{numberRank:6,nameRank:"Eight",initial:"8",suit:"Diamonds",name:"Eight of Diamonds"},{numberRank:7,nameRank:"Nine",initial:"9",suit:"Diamonds",name:"Nine of Diamonds"},{numberRank:8,nameRank:"Ten",initial:"10",suit:"Diamonds",name:"Ten of Diamonds"},{numberRank:9,nameRank:"Jack",initial:"J",suit:"Diamonds",name:"Jack of Diamonds"},{numberRank:10,nameRank:"Queen",initial:"Q",suit:"Diamonds",name:"Queen of Diamonds"},{numberRank:11,nameRank:"King",initial:"K",suit:"Diamonds",name:"King of Diamonds"},{numberRank:12,nameRank:"Ace",initial:"A",suit:"Diamonds",name:"Ace of Diamonds"}],m={numberRank:99,nameRank:"Joker",initial:"JO",suit:"Joker",name:"Joker (Plain)"},r={numberRank:99,nameRank:"Joker",initial:"JO",suit:"Joker",name:"Joker (Fancy)"},d=[...n,m,r],R={FancyJoker:r,PlainJoker:m,standard52DeckOfCards:n,standard52DeckOfCardsWithJokers:d};var e=class{drawPile;discardPile;constructor(a){this.drawPile=a,this.discardPile=[],this.shuffle(7);}shuffle(a){for(var u=this.drawPile.length,i=0;i<a;i++)for(let s of this.drawPile){let o=this.drawPile.indexOf(s),t=Math.floor(Math.random()*u);this.drawPile[o]=this.drawPile[t],this.drawPile[t]=s;}}addToBottomOfDiscardPile(a){this.discardPile.push(...a);}addToDiscardPile(a){this.addToTopOfDiscardPile(a);}addToTopOfDiscardPile(a){this.discardPile.unshift(...a);}drawFromDiscardPile(a){return this.discardPile.splice(0,a)}addToBottomOfDrawPile(a){this.drawPile.push(...a);}addToDrawPile(a){this.addToBottomOfDrawPile(a);}addToTopOfDrawPile(a){this.drawPile.unshift(...a);}drawFromDrawPile(a){return this.drawPile.splice(0,a)}};new e(n);

  /**
   * @typedef {Object} MO52Card
   * @prop {number} numberRank
   * @prop {string} nameRank
   * @prop {string} initial // The card's "symbol"
   * @prop {string} suit
   * @prop {string} name
   * @prop {number} value
   * @prop {boolean} facingDown
   */
  /**
   * @typedef {{[x: string]: {cards: MO52Card[]}}} Piles
   */

  const suitIcons = {
    C: "♣",
    H: "♥",
    S: "♠",
    D: "♦",
    J: "☹︎", // Joker
    any: "★"
  };

  // Suit colors for when suit is not a match
  // Key: card.suit
  const suitColor = {
    [suitIcons["C"]]: "Black",
    [suitIcons["H"]]: "Red",
    [suitIcons["S"]]: "Black",
    [suitIcons["D"]]: "Red",
    [suitIcons["C"] + suitIcons["S"]]: "Black", // Clubs and Spades
    [suitIcons["H"] + suitIcons["D"]]: "Red", // Hearts and Diamonds
  };

  // Initialize Cards
  const BaseCards = /** @type MO52Card[] */ (R.standard52DeckOfCards).map((card) => {
    // Adjust value for zero-based numberRank
    if (card.nameRank !== "Ace") {
      card.value = card.numberRank + 2;
    }

    // Set Aces to value of 1
    if (card.nameRank === "Ace") {
      card.value = 1;
    }

    // Setup suit icons
    card.suit = suitIcons[card.suit[0]];

    // Rename Royals to their number rank and provide target hints
    if (card.nameRank === "Jack") {
      card.initial = "11";
      card.suit = suitIcons["any"];
    } else if (card.nameRank === "Queen") {
      card.initial = "12";
      if (card.suit === suitIcons["C"] || card.suit === suitIcons["S"]) {
        card.suit = suitIcons["C"] + suitIcons["S"]; // Clubs and Spades
      } else {
        card.suit = suitIcons["H"] + suitIcons["D"]; // Hearts and Diamonds
      }
    } else if (card.nameRank === "King") {
      card.initial = "13";
    }

    // Turn all cards face-down to start
    card.facingDown = true;

    return card;
  });

  // Add a Joker with value of 0
  BaseCards.push({ ...R.FancyJoker, initial: "0", value: 0, facingDown: true, suit: suitIcons["J"] });

  // Initialize Deck
  const moDeck = new e(BaseCards);

  // Pile Ids for inner and outer piles, used for iterating over piles
  const InnerPileIds = ["b2", "c2", "d2", "b3", "c3", "d3", "b4", "c4", "d4"];
  const OuterPileIds = ["b1", "c1", "d1", "a2", "e2", "a3", "e3", "a4", "e4", "b5", "c5", "d5"];

  // Lists the nearest inner pile for a given outer pile key
  const NearestInnerPile = {
    b1: "b2",
    c1: "c2",
    d1: "d2",
    a2: "b2",
    e2: "d2",
    a3: "b3",
    e3: "d3",
    a4: "b4",
    e4: "d4",
    b5: "b4",
    c5: "c4",
    d5: "d4",
  };

  // Rows and columns along with their royals, used to check if the royal has been defeated
  // Key: the "to pile", aka the pile a card was just dropped on
  // Value: the unit(s) which need to be checked for 'defeat' condition (1 or 2 units per key, 2 if on a corner)
  /** @type {{[x: string]: Array<{cardsToCheck: string[], royalPile: string}>}} */
  const RoyalUnits = {
    b2: [
      { cardsToCheck: ["c2", "d2"], royalPile: "e2" },
      { cardsToCheck: ["b3", "b4"], royalPile: "b5" },
    ],
    c2: [{ cardsToCheck: ["c3", "c4"], royalPile: "c5" }],
    d2: [
      { cardsToCheck: ["c2", "b2"], royalPile: "a2" },
      { cardsToCheck: ["d3", "d4"], royalPile: "d5" },
    ],
    b3: [{ cardsToCheck: ["c3", "d3"], royalPile: "e3" }],
    c3: [], // Center can't trigger any kills
    d3: [{ cardsToCheck: ["c3", "b3"], royalPile: "a3" }],
    b4: [
      { cardsToCheck: ["c4", "d4"], royalPile: "e4" },
      { cardsToCheck: ["b3", "b2"], royalPile: "b1" },
    ],
    c4: [{ cardsToCheck: ["c3", "c2"], royalPile: "c1" }],
    d4: [
      { cardsToCheck: ["c4", "b4"], royalPile: "a4" },
      { cardsToCheck: ["d3", "d2"], royalPile: "d1" },
    ],
  };

  // Initialize Piles
  /** @type Piles */
  let PILES = {
    a2: { cards: [] },
    a3: { cards: [] },
    a4: { cards: [] },
    b1: { cards: [] },
    b2: { cards: [] },
    b3: { cards: [] },
    b4: { cards: [] },
    b5: { cards: [] },
    c1: { cards: [] },
    c2: { cards: [] },
    c3: { cards: [] },
    c4: { cards: [] },
    c5: { cards: [] },
    d1: { cards: [] },
    d2: { cards: [] },
    d3: { cards: [] },
    d4: { cards: [] },
    d5: { cards: [] },
    e2: { cards: [] },
    e3: { cards: [] },
    e4: { cards: [] },
    e5: { cards: moDeck.drawPile },
  };

  // Helper function to replace PILES with one from history
  function replacePiles(newPiles) {
    PILES = newPiles;
  }

  // Helper function to determine
  function isRoyal(card) {
    return card.value > 10;
  }

  function getPileCards(pileID) {
    return PILES[pileID].cards;
  }

  /** @returns {import("./constants").MO52Card | undefined} */
  function getTopCard(pileID) {
    return PILES[pileID].cards.slice(0, 1)[0];
  }
  /** @param {import("./constants").MO52Card[]} cards  */

  function getRoyalCard(cards) {
    return cards.find((card) => isRoyal(card));
  }

  function collectAndShuffleCards() {
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

  function dealOutInitialCards() {
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

  // Get card templates for making cards
  const faceUpTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("faceUpCardTemplate"));
  const faceDownTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("faceDownCardTemplate"));

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

    if (fdCardEl) {
      // Set the index
      fdCardEl.setAttribute("style", `--index: ${index}`);

      // Label the card as "Dead"
      const cardBack = fdCardEl.querySelector(".mo-card__back");
      if (cardBack) cardBack.textContent = "Dead";
    }

    return faceDownCard;
  }

  function renderCards() {
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

      // Next, append cards to pile
      const pileEl = document.querySelector(`#${pileName}.pile`);
      pileEl?.replaceChildren(...cardEls);
    });
  }

  // Function to create commandManagers, should be one per game to manage history (undo/redo)
  const createCommandManager = () => {
    /** @type {{prevPile: import("./constants").Piles, nextPile: import("./constants").Piles}[]} */
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
  function shiftCards(fromPile, toPile) {
    // Shift off top card from origin pile
    const topCard = PILES[fromPile].cards.shift();

    // if card found, process it (if needed), then add it to destination pile and reveal next top card
    if (topCard) {
      // If top card is an Ace or Joker, move the whole "to" pile to the bottom of the draw pile before moving the top card
      if (topCard.nameRank === "Ace" || topCard.nameRank === "Joker") {
        const cards = PILES[toPile].cards.splice(0);
        cards.forEach((card) => (card.facingDown = true));
        PILES["e5"].cards.push(...cards);
      }

      // Get next top card and reveal it (if there is one)
      if (PILES[fromPile].cards.length) PILES[fromPile].cards[0].facingDown = false;

      // Shift on the top card to the top of the "To" pile
      PILES[toPile].cards.unshift(topCard);

      // If the toPile is an outer pile, add the value of the new card to the top royal
      if (OuterPileIds.includes(toPile)) {
        PILES[toPile].cards.forEach((card) => {
          if (isRoyal(card) && !isRoyal(topCard)) {
            const newValue = Number(card.initial) + topCard.value;
            card.initial = String(newValue);
          }
        });
      }
    }
  }

  // Counts up value of pile's cards, used for royal piles
  function getPileValue(/** @type {import("./constants").MO52Card[]} */ pileCards) {
    return pileCards.reduce((acc, card) => {
      return (acc += card.value);
    }, 0);
  }

  // Checks if a royal card is present and face-down
  /** @param {import("./constants").MO52Card[]} pileCards */
  function checkIfRoyalDefeated(pileCards) {
    return pileCards.some((card) => isRoyal(card) && card.facingDown);
  }

  // Determines which piles are 'legal' targets for drag and drop
  /** @param {import("./constants").MO52Card} card */
  function getValidPiles(card) {
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
   * @param {import("./constants").MO52Card} card
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
  /** @param {import("./constants").MO52Card} card */
  function getRoyalPileMatches(card) {
    let validPileMatches = /** @type PileMatch[] */ ([]);

    // Reduce OuterPileIds into validPileMatches
    validPileMatches = OuterPileIds.reduce((acc, pileID) => {
      // Return early if outer pile not empty (aka not a valid pile)
      if (PILES[pileID].cards.length !== 0) return acc;

      // Get the nearest neighbor's top card
      const neighborPile = NearestInnerPile[pileID];
      const topNeighbor = /** @type {import("./constants").MO52Card} */ (getTopCard(neighborPile));

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
   * @param {import("./constants").MO52Card} topNeighbor
   * @param {import("./constants").MO52Card} card
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
   * @param {import("./constants").MO52Card} topNeighbor
   * @param {import("./constants").MO52Card} card
   * @returns {PileMatch | null}
   */
  function getColorMatch(pileID, topNeighbor, card) {
    const neighborSuit = topNeighbor.suit;
    const neighborColor = suitColor[neighborSuit];
    const neighborValue = topNeighbor.value;
    return neighborColor === suitColor[card.suit] ? { pileID, neighborValue, matchType: "color" } : null;
  }

  // Function to check which outer piles might be valid for a given non-royal card
  /** @param {import("./constants").MO52Card} card */
  function getValidOuterPiles(card) {
    return OuterPileIds.reduce((acc, pileID) => {
      const pileCards = getPileCards(pileID);

      // Check if empty and return early if so
      if (pileCards.length === 0) {
        return acc;
      }

      // If there's a royal, check that the royal hasn't already been defeated
      if (checkIfRoyalDefeated(pileCards)) {
        return acc;
      }

      // Check that the total value won't exceed 21
      const pileValue = getPileValue(pileCards);
      if (pileValue + card.value < 21) {
        acc.push(pileID);
      }

      return acc;
    }, /** @type {string[]} */ ([]));
  }

  // Function to check for "lowest value piles" when looking for valid Joker positions
  /** @returns {string[]} */
  function getValidJokerPiles() {
    return InnerPileIds.map((pileID) => {
      const topCard = getTopCard(pileID);
      return { value: topCard?.value || 99, pileID };
    })
      .sort((a, b) => {
        return a.value - b.value;
      })
      .reduce((acc, pileAndValue) => {
        if (acc.length === 0 && pileAndValue.value < 99) {
          // Init the accumulator if empty
          acc.push(pileAndValue);
        } else if (acc[0].value === pileAndValue.value) {
          // If two objs have same value, add them
          acc.push(pileAndValue);
        } else if (acc[0].value > pileAndValue.value) {
          // If old value is greater than new value, replace acc with new
          acc = [pileAndValue];
        }
        return acc;
      }, /** @type {{value: number, pileID: string}[]} */ ([]))
      .map((obj) => obj.pileID);
  }

  // Function to check which inner piles might be valid for a given card
  /** @param {import("./constants").MO52Card} card */
  function getValidInnerPiles(card) {
    if (card.value === 0) return getValidJokerPiles();

    return InnerPileIds.reduce((acc, pileID) => {
      // If an Ace add the pileId and return early
      if (card.value === 1) {
        acc.push(pileID);
      } else {
        // Get top card, if any
        const topPileCard = getTopCard(pileID);

        // Check if topPileCard is same or lower value, or if pile is empty
        if ((topPileCard && topPileCard.value <= card.value) || !topPileCard) {
          acc.push(pileID);
        }
      }

      return acc;
    }, /** @type {string[]} */ ([]));
  }

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
  const createGameManager = () => {
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

  // Initialize CommandManager var for later use
  let CommandManager;

  // Initialize GameManager var for later use
  /** @type {import("./GameManager").GameManager} */
  let GameManager;

  // Initializes a new game
  function newGame() {
    // Setup a new command manager for this game
    CommandManager = createCommandManager();

    // Setup a new game manager for this game
    GameManager = createGameManager();

    // Collect all cards from all piles
    collectAndShuffleCards();

    // Deal cards out to central piles
    dealOutInitialCards();

    // Render the current state of the piles
    renderCards();

    // Highlight valid moves for the card in the draw pile
    highlightValidPilesForDrawPile();
  }

  // Setup 'onload' event listener
  document.addEventListener("DOMContentLoaded", function () {
    newGame();

    // Setup click listeners for card placement
    const pileElements = Array.from(document.getElementsByClassName("pile"));
    pileElements.forEach(pileEl => {
      if (pileEl.id !== "e5") { // Don't add click listener to the draw pile
        pileEl.addEventListener("click", function() {
          // When a pile is clicked, check if it's a valid target for the top card of the draw pile
          const targetPileId = pileEl.id;
          if (pileEl.classList.contains("pile--valid")) {
            // If valid, execute the move
            CommandManager.doShift("e5", targetPileId);

            // Call GameManager.tick to check for game win/loss conditions
            GameManager.tick(targetPileId);

            // Render the updated state of the piles
            renderCards();

            // Highlight valid piles for the next draw pile card
            highlightValidPilesForDrawPile();
          }
        });
      }
    });
  });

  // Setup button event listeners
  document.getElementById("newGameButton")?.addEventListener("click", () => newGame());
  document.getElementById("undoButton")?.addEventListener("click", () => {
    CommandManager.undo(); // This already calls renderCards()
    highlightValidPilesForDrawPile();
  });

  document.getElementById("redoButton")?.addEventListener("click", () => {
    CommandManager.redo(); // This already calls renderCards()
    highlightValidPilesForDrawPile();
  });

  // Highlights 'legal' drop targets
  /** @param {string[]} validPiles */
  function highlightValidPiles(validPiles) {
    validPiles.forEach((pileId) => {
      const pileEl = document.getElementById(pileId);
      pileEl?.classList.add("pile--valid");
    });
  }

  // Clears highlighted valid piles
  function removeHighlights() {
    const currentHighlights = Array.from(document.getElementsByClassName("pile--valid"));
    currentHighlights.forEach((el) => el.classList.remove("pile--valid"));
  }

  function highlightValidPilesForDrawPile() {
    removeHighlights(); // Clear any existing highlights first
    const card = getTopCard("e5");
    if (card) {
      const validPiles = getValidPiles(card);
      if (validPiles.length) {
        highlightValidPiles(validPiles);
      }
    }
  }

})();
