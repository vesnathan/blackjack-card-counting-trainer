export const GAME_RULES = () => {
  const gameRulesArray = () => {
    const numDecks = 8;
    const dealerHit16 = true;
    const dealerStand17 = true;
    const splitAces = true;
    const splitAcesTimes = 1;
    const splitAcesCards = 1;
    const splitTimes = 3;
    const doubleAfterSplit = true;
    const blackJackPays32 = true;
    const tableOverlays = [
      "BLACKJACK PAYS 3 TO 2",
      " DEALER HITS ON 16    ",
      " \u00A0  \u00A0  \u00A0  \u00A0 \u2663 \u2664 \u2665 \u2666 \u00A0 \u00A0 \u00A0 \u00A0 DEALER STANDS ON 17"
    ];
    return {
      numDecks, 
      dealerHit16, 
      dealerStand17, 
      splitAces, 
      splitAcesTimes, 
      splitAcesCards, 
      splitTimes, 
      doubleAfterSplit, 
      blackJackPays32,
      tableOverlays
    };
  }
  return gameRulesArray();
}