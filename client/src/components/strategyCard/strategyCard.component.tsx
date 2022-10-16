import React from 'react';
import './strategyCard.component.css';

// Material UI Components
import Grid from '@mui/material/Grid';

let strategyCardHard = [
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
let strategyCardSoft = [
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
let pairs = [
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

const StrategyCard = (): JSX.Element => {
  return (
    <Grid container  className="strategyCardContainer" >
      <Grid item  xs={4} >
          <table>
            <tbody>
              <tr><td colSpan={11} className="header">HARD TOTALS</td></tr>
              <tr>
                <td className="stratChart"></td>
                <td className="stratChart">2</td>
                <td className="stratChart">3</td>
                <td className="stratChart">4</td>
                <td className="stratChart">5</td>
                <td className="stratChart">6</td>
                <td className="stratChart">7</td>
                <td className="stratChart">8</td>
                <td className="stratChart">9</td>
                <td className="stratChart">10</td>
                <td className="stratChart">A</td>
              </tr>
              {
                strategyCardHard.map((playerHard, index) => {
                  return (
                    <>
                  <tr key={`${index}-stratChart-hard`}>
                  <td className="stratChart" >{index+4}</td>
                    {
                      playerHard.map((playerDo, index2) => {
                          return <td key={`${index}-${index2}-stratChart-hard`} className={`${playerDo}-stratChart stratChart`}>{playerDo}</td>
                      })
                    }
                  </tr>
                  </>
                  )
                })  
              }
            </tbody>  
          </table>
      </Grid>
      <Grid item  xs={4} >
          <table>
            <tbody>
            <tr><td colSpan={11} className="header">SOFT TOTALS</td></tr>
              <tr>
                  <td className="stratChart">2</td>
                  <td className="stratChart">3</td>
                  <td className="stratChart">4</td>
                  <td className="stratChart">5</td>
                  <td className="stratChart">6</td>
                  <td className="stratChart">7</td>
                  <td className="stratChart">8</td>
                  <td className="stratChart">9</td>
                  <td className="stratChart">10</td>
                  <td className="stratChart">A</td>
                </tr>
              {
                strategyCardSoft.map((playerSoft, index) => {
                  return (
                    <>
                  <tr key={`${index}-stratChart-soft`}>

                    {
                      playerSoft.map((playerDo, index2) => {
                          return <td key={`${index}-${index2}-stratChart-soft`} className={`${playerDo}-stratChart stratChart`}>{playerDo}</td>
                      })
                    }
                  </tr>
                  </>
                  )
                })  
              }
            </tbody>  
          </table>
      </Grid>
      <Grid item  xs={4}  >
          <table>
            <tbody>
              <tr><td colSpan={11} className="header stratChart">PAIRS</td></tr>
              <tr>
                <td className="stratChart"></td>
                <td className="stratChart">2</td>
                <td className="stratChart">3</td>
                <td className="stratChart">4</td>
                <td className="stratChart">5</td>
                <td className="stratChart">6</td>
                <td className="stratChart">7</td>
                <td className="stratChart">8</td>
                <td className="stratChart">9</td>
                <td className="stratChart">10</td>
                <td className="stratChart">A</td>
              </tr>
              {
                pairs.map((playerPair, index) => {
                  return (
                    <>
                  <tr key={`${index}-stratChart-pairs`}>
                    <td className="stratChart" >{(index+2 === 11)?"A":index+2}</td>

                    {
                      playerPair.map((playerDo, index2) => {
                          return <td key={`${index}-${index2}-stratChart-pairs`} className={`${playerDo}-stratChart stratChart`}>{playerDo}</td>
                      })
                    }
                  </tr>
                  </>
                  )
                })  
              }
            </tbody>  
          </table>
      </Grid>
    </Grid>
  )
}
  
export default StrategyCard;

 
	
