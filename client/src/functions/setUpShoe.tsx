const SetUpShoe = (numDecks: number) => {
  //const state: any = useGameContext();
  //const { numDecks } = state.state.appStatus;
  let tempShoe:Array<Object> = [];
  let suits: Array<string> =  ["H","D","C","S"]; 

  let pips: Array<string> =   ["A",   "2",  "3",  "4",  "5",  "6",  "7",  "8",  "9",  "10",  "J",   "Q",   "K"  ];
  let count: Array<number> =  [ -1 ,   1 ,   1 ,   1 ,   1 ,   1 ,   0 ,   0 ,   0 ,   -1 ,   -1 ,   -1 ,   -1  ];
  let points: Array<number> = [ 11 ,   2 ,   3 ,   4 ,   5 ,   6 ,   7 ,   8 ,   9 ,   10 ,   10 ,   10 ,   10  ];

  for (let deck = 0; deck < numDecks; deck++) {
    suits.forEach((suit, suitIndex) => {
      pips.forEach((pip, pipIndex) => {
        const tempCard: Object = 
        {
          suit: suit,
          pip: pip,
          count: count[pipIndex],
          points: points[pipIndex]
        }
        tempShoe.push(tempCard);
      })
    })
  }
  return tempShoe;
}

export default SetUpShoe;