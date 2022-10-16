export const STRATEGY_HARD: Array<Array<string>> = [
    //  Dealer Up Card
    //  2     3     4     5     6     7     8     9     10    A
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // hard 4
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // hard 5
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // hard 6
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // hard 7
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // hard 8
    [   "H",  "D",  "D",  "D",  "D",  "H",  "H",  "H",  "H",  "H"], // hard 9
    [   "D",  "D",  "D",  "D",  "D",  "D",  "D",  "D",  "H",  "H"], // hard 10
    [   "D",  "D",  "D",  "D",  "D",  "D",  "D",  "D",  "D",  "H"], // hard 11
    [   "H",  "H",  "S",  "S",  "S",  "H",  "H",  "H",  "H",  "H"], // hard 12
    [   "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H",  "H",  "H"], // hard 13
    [   "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H",  "H",  "H"], // hard 14
    [   "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H",  "H",  "H"], // hard 15
    [   "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H",  "H",  "H"], // hard 16
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // hard 17
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // hard 18
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // hard 19
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // hard 20
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // hard 21
  ];

export const STRATEGY_SOFT: Array<Array<string>> = [
    //  Dealer Up Card
    //  2     3     4     5     6     7     8     9     10    A
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 4
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 5
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 6
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 7
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 8
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 9
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 10
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 11
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 12
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 13
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 14
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 15
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 16
    [   "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"], // soft 17
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H"], // soft 18
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // soft 19
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // soft 20
    [   "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"], // soft 21
  ];


export const STRATEGY_PAIRS: Array<Array<string>> = [
    //  Dealer Up Card
    //  2     3     4     5     6     7     8     9     10    A
    [   "SP", "SP", "SP", "SP", "SP", "SP", " ",  " ",  " ",  " "], // 2,2
    [   "SP", "SP", "SP", "SP", "SP", "SP", " ",  " ",  " ",  " "], // 3,3
    [   "  ", "  ", "  ", "SP", "SP", "  ", " ",  " ",  " ",  " "], // 4,4
    [   "  ", "  ", "  ", "  ", "  ", "  ", " ",  " ",  " ",  " "], // 5,5
    [   "SP", "SP", "SP", "SP", "SP", "  ", " ",  " ",  " ",  " "], // 6,6
    [   "SP", "SP", "SP", "SP", "SP", "SP", " ",  " ",  " ",  " "], // 7,7
    [   "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP"], // 8,8
    [   "SP", "SP", "SP", "SP", "SP", "  ", "SP", "SP", "  ", "  "], // 9,9
    [   "SP", "SP", "SP", "SP", "SP", "  ", "SP", "SP", "  ", "  "], // 10,10
    [   "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP"], // A,A
  ];