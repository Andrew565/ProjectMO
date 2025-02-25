# Project MO Flow Diagram

NOTE: This Flow document is wildly out of date now, I wrote it before I split everything up into separate modules. I may or may not update it in the future, but it served it's purpose.

## Upon Page Load

1. HTML Loads
   1. `detail` accordion with game summary
   2. Game controls
   3. Grid of card piles
   4. Templates for face-up, face-down, and empty cards
   5. Load JS bundle
2. JavaScript Runs
   1. `import` StandardCards and DeckOfCards from deck-of-cards.js
   2. Define MO52Card and Piles types
   3. Define suitIcons object map
   4. Initialize BaseCards and moDeck
      1. Map over the StandardCards.standard52DeckOfCards object:
         1. If not an Ace, adjust "card value" to start at 2 instead of 0
         2. If it is an Ace, set value to 1
         3. If it is a 10, rename to "X" so it styles better
         4. Assign suit icon based on first letter of suit
         5. Set all cards to start out face-down
      2. Add a "FancyJoker" card with value of 0
      3. Create moDeck using `new DeckOfCards(BaseCards)`
   5. Initialize OuterPileIds and InnerPileIds for easy lookup of positions later
   6. Initialize the in-memory representation of the card `PILES`
      1. Each pile starts as an empty array, except for "e5" which starts out containing the entire deck of cards (`moDeck.drawPile`)
   7. Create Function `isRoyal(card)`
   8. Init the CommandManager as an undefined object
   9. Create Function `newGame()`
   10. Add `click` Event Listeners
       1. `newGameButton` -> `newGame()`
       2. `undoButton` -> `CommandManager.undo()`
       3. `redoButton` -> `CommandManager.redo()`
   11. Create Function `dealOutInitialCards()`
   12. Create Function `makeFaceUpCard(chosenCard, index)`
   13. Create Function `makeFaceDownCard(index)`
   14. Create Function `makeEmptyCard(index)`
   15. Create Function `renderCards()`
   16. Create Function `shiftCards(fromPile, toPile)`
   17. Create Function `createCommandManager()`
   18. Create Function `getPileValue(pileCards)`
   19. Create Function `checkIfRoyalDefeated(pileCards)`
   20. Create Function `getValidPiles(card)`
   21. Create Function `highlightValidPiles(validPiles)`
   22. Create Function `removeHighlights()`
   23. Init Drag and Drop Stuff
       1. Init `pileEls`
       2. Init `drake` using `dragula(pileEls, {moves})`
          1. `moves` is a function which checks to make sure the user is not trying to move a card from an inner or outer pile (not allowed to move cards after they've been placed (unless you use the undo button))
       3. Set `drake.on("drag", cb(_, source))`
          1. `cb` function first makes a copy of the top card of the source pile
          2. Get the list of `validPiles` from `getValidPiles(card)`
          3. If one or more `validPiles`, it calls `highlightValidPiles(validPiles)`
       4. Set `drake.on("drop", cb(_, target, source))`
          1. First, `removeHighlights()`
          2. Init `fromPile` and `toPile`
          3. Make a copy of the top card from the source pile
          4. Get the list of `validPiles` from `getValidPiles(card)`
          5. If `!validPiles.includes(toPile)` then stop the transfer and return early as it is not a valid move
          6. If a valid move, call `CommandManager.doShift(fromPile, toPile)`
   24. Last but not least, add a "DOMContentLoaded" event listener that calls `newGame()` when the document is ready
       1. Makes sure that there's a new game ready to play as soon as possible

## `isRoyal(card)`

1. Card is a `MO52Card`
2. Returns `card.value > 10`

## `newGame()`

1. Init the `CommandManager` using `createCommandManager()`
2. Collect up all cards from all piles except "e5" and adds them to draw pile
   1. Uses `cards.splice(0)` to remove all cards from the existing piles
   2. Uses `moDeck.addToDrawPile(pileCards)` to add to the draw pile
3. Call `moDeck.shuffle(3)` to give a minimally good shuffle
4. Call `dealOutInitialCards()`
5. Call `renderCards()`

## `dealOutInitialCards()`

1. Deal cards out to central piles
   1. Init `allPilesDealt = false` so we know when we're done
   2. Init `royals = []` so we can keep royals separated out for later
   3. Init `innerPilesList` as a copy of `InnerPileIds` so we know which piles have and haven't been dealt to yet
   4. `while (!allPilesDealt)`
      1. Get the next `card` via `moDeck.drawFromDrawPile`
      2. If `isRoyal(card)` push onto `royals`
      3. Else:
         1. Get `currentPile` via `innerPilesList.shift()`
         2. Make sure the currentPile isn't "c3" (the center pile, which this game leaves empty during initial deal)
         3. Set `card` to be face-up
         4. Push `card` onto `PILES[currentPile].cards`
      4. If there are no more innerPiles, set `allPilesDealt = true`
   5. Add `royals` to top of draw pile via `moDeck.addToTopOfDrawPile(royals)`

## `makeFaceUpCard(chosenCard, index)`

1. Clone the `faceUpTemplate` as `faceUpCard`
2. Get the main `.mo-card` `cardEl`
3. Set the index variable for this card
4. Get the rank el and set it to `chosenCard.initial`
5. Get the suit el and set it to `chosenCard.suit`
6. Get the name el and set it to `chosenCard.name`
   1. NOTE: Not currently displaying the name visually
7. Return the `faceUpCard`

## `makeFaceDownCard(index)`

1. Clone the `faceDownTemplate` as `faceDownCard`
2. Get the main `.mo-card` el
3. Set the `index` variable on the el
4. Return the `faceDownCard`

## `makeEmptyCard(index)`

1. Clone the `emptyTemplate` as `emptyCard`
2. Get the main `.mo-card` el
3. Set the `index` variable on the el
4. Return the `emptyCard`

## `renderCards()`

1. `Object.entries(PILES).forEach`:
   1. Clone the pile's cards as `cardsClone`
   2. If an inner pile, reverse the order so that [0] ends up on top
   3. Get `cardEls` via `cardsClone.map`:
      1. If `card.facingDown` return `makeFaceDownCard(index)`
      2. Else return `makeFaceUpCard(card, index)`
   4. Get `nextIndex` via `cardEls.length`
   5. Get `emptyCard` via `makeEmptyCard(index)`
   6. `cardEls.push(emptyCard)`
   7. Next, render cards to the pile
      1. Get `pileEl` via `querySelector`
      2. `pileEl?.replaceChildren(...cardEls)`
2. Render the draw pile top card
   1. Get `topCard` via `moDeck.drawPile[0]`
   2. Set `facingDown` to false
   3. Get `cardEl` via `makeFaceUpCard(topCard, 99)`
      1. Setting the card's index really high so that it 'floats' above all of the other cards when dragging
   4. Get `pileEl` via `querySelector("#e5.pile")`
   5. `pileEl?.replaceChildren(cardEl)`

## `shiftCards(fromPile, toPile)`

1. Get `topCard` from `PILES[fromPile].cards.shift()`
2. If `topCard` found:
   1. If an Ace or a Joker:
      1. Get `cards` from `toPile`
      2. Push `cards` onto `PILES.e5.cards`
   2. If there are more cards in `fromPile`, set the top one to `facingDown = false`
   3. Add `topCard` to top of `toPile`

## `createCommandManager()`

1. Init `history` as an array of `{prevPile, nextPile}` objects
   1. NOTE: see below, uses structuredClone to clone the PILES object
2. Init `position` as `0` (history position)
3. Return an object with `doShift`, `undo`, and `redo` functions (see below)

## `CommandManager.doShift(fromPile, toPile)`

1. if `position` is not at the end of `history` (aka `history.length - 1`):
   1. Slice `history` so as to only keep what is at the current `position` or older
2. Get `prevPile` by cloning `PILES`
3. Call `shiftCards(fromPile, toPile)`
4. Get `nextPile` by cloning `PILES`
5. Push onto `history` the `{prevPile, nextPile}` object
6. Increment `position` by 1
7. Call `renderCards`

## `CommandManager.undo()`

1. If `position > 0` (i.e. not at the start of `history`):
   1. Get `prevPile` from current `history[position]`
   2. Decrement `position` by 1
   3. Replace `PILES = prevPile`
2. Call `renderCards()`

## `CommandManager.redo()`

1. If `position < history.length -1` (i.e. not at the end):
   1. Increment `position` by 1
   2. Get `nextPile` from current `history[position]`
   3. Replace `PILES = nextPile`
2. Call `renderCards()`

## `getPileValue(pileCards)`

1. NOTE: Used to calculate value of "royal" piles
2. Return `pileCards.reduce`:
   1. Return `acc += card.value` (adds up all values)

## `checkIfRoyalDefeated(pileCards)`

1. NOTE: Checks if a royal card is present and face-down, used by `getValidPiles` to determine if a card can be placed on this pile
2. Return `pileCards.some`:
   1. Return `isRoyal(card)` && `card.facingDown`

## `getValidPiles(card)`

1. Init an undefined `validOuterIds`
2. If `isRoyal(card)`:
   1. Get `validOuterIds` via `getValidOuterPiles(card)`
   2. Return `validOuterIds` if any, else `[]`
3. Return `getValidInnerPiles(card)`

## `getValidOuterPiles(card)`

1. Return `OuterPileIds.reduce(acc, pileId)`:
   1. Get `pileCards` via `(PILES[pileId].cards).slice(0)`
   2. If no `pileCards` push `pileId` onto `acc`
   3. If `checkIfRoyalDefeated(pileCards)` return acc
   4. Get `pileValue` via `getPileValue(pileCards)`
   5. If `pileValue + card.value < 21` (valid up to 21 points):
      1. Push `pileId` onto `acc`
   6. Return `acc`

## `getValidInnerPiles(card)`

1. Return `InnerPiles.reduce(acc, pileId)`:
   1. If `card` is an Ace or Joker, push `pileId` onto `acc`
   2. Else:
      1. Get `topPileCard` from `PILES[pileId].cards`
      2. If `topPileCard` found and `topPileCard.value <= card.value`:
         1. Push `pileId` onto `acc`
   3. Return `acc`

## `highlightValidPiles(validPiles)`

1. `validPiles.forEach(pileId)`:
   1. Get `pileEl` via `getElementById(pileId)`
   2. Add "pile--valid" class to `pileEl`

## `removeHighlights()`

1. Get `currentHighlights`
2. Remove "pile--valid" from `currentHighlights`
