export const PLAYERS = () => {
  const playersArray = () => {
    const tablePositions = [[50,20],[11,55],[29,62],[48.25,65],[68,62],[86,55]];
    const player = (i: number) => {
      const position = tablePositions[i];    
      const hand: any = [];
      const handCount = 0; 
      const busted = false;
      const playerType = (i===0)?"dealer":"ai"; 
      const aiDumbAssFactor = .05; 
      const aiChattyFactor = .05; 
      const playerHandResult = "";
      return { position, hand, handCount, busted, playerType, aiDumbAssFactor, aiChattyFactor , playerHandResult }
    }
    return ( [ player(0), player(1), player(2), player(3), player(4), player(5) ] );
  }
  return playersArray();
}
