import './playingCard.component.css';
import { useState } from 'react';

// Custom Components
import { PipA, Pip2, Pip3, Pip4, Pip5, Pip6, Pip7, Pip8, Pip9, Pip10, PipJ, PipQ, PipK } from "../cardLayouts/cardLayouts.component";

// Material UI Components
import Grid from '@mui/material/Grid';

type AppProps = {
  cardSuit: string;
  cardPip: string;
  showDealerDownCard: boolean;
  dealerDownCard: boolean;
};

const PlayingCard = ({ cardSuit, cardPip, dealerDownCard, showDealerDownCard}: AppProps): JSX.Element => {
const [showCard, setShowCard] = useState(false);
setTimeout(() => {
  setShowCard(true);
},500);
  let thisCard: string[] = [];
  switch (cardPip) {
    case "A":
      thisCard = PipA();
      break;
    case "2":
      thisCard = Pip2();
      break;
    case "3":
      thisCard = Pip3();
      break;
    case "4":
      thisCard = Pip4();
      break;
    case "5":
      thisCard = Pip5();
      break;
    case "6":
      thisCard = Pip6();
      break;
    case "7":
      thisCard = Pip7();
      break;
    case "8":
      thisCard = Pip8();
    break;
    case "9":
      thisCard = Pip9();
      break;
    case "10":
      thisCard = Pip10();
      break;
    case "J":
      thisCard = PipJ();
      break;
    case "Q":
      thisCard = PipQ();
      break;
    case "K":
      thisCard = PipK();
      break;
  }
  let thisSuit: number = 0;
  switch (cardSuit) {
    case "H":
      thisSuit = 9829;
      break;
    case "D":
      thisSuit = 9830;
      break;
    case "C":
      thisSuit = 9827;
      break;
    case "S":
      thisSuit = 9824;
      break;
  }



  return (
    <>
      { 
        showCard ? 
          !dealerDownCard  || showDealerDownCard ? (     
            <div className="playingCardWrapper" >
              <div className="playingCard">
                <div className={`tl ${cardSuit}`}>
                  <div className="cardPipValueHolder">
                    <div>{cardPip}</div>
                    <div>{String.fromCharCode(thisSuit)}</div>
                  </div>
                </div>
                <div className={`tr ${cardSuit}`}>
                  <div className="cardPipValueHolder">
                    <div>{cardPip}</div>
                    <div>{String.fromCharCode(thisSuit)}</div>
                  </div>
                </div>
                <div className={`bl ${cardSuit}`}>
                  <div className="cardPipValueHolder">
                    <div>{cardPip}</div>
                    <div>{String.fromCharCode(thisSuit)}</div>
                  </div>
                </div>
                <div className={`br ${cardSuit}`}>
                  <div className="cardPipValueHolder">
                    <div>{cardPip}</div>
                    <div>{String.fromCharCode(thisSuit)}</div>
                  </div>
                </div>
                <div className="pipHolder">
                  <Grid container style={{height: '100%', textAlign: "center" }} >
                    {
                      thisCard.map((pip, index) => {
                        if (pip === "X") {
                          return (
                            <>
                              <Grid item xs={4} display="flex"
                                justifyContent="center"
                                alignItems="center"
                                className="pipWrapper">
                                  <div className={`${cardSuit} pip`}>
                                    <span>{String.fromCharCode(thisSuit)}</span>
                                  </div>              
                              </Grid>
                            </>
                          );
                        }
                        if (pip === "O") {
                            return (
                              <Grid item xs={4} className="pipWrapper">
                                <div className="pip"></div>
                              </Grid>
                            )
                        }
                        if (pip === "A") {
                            return (    
                                <div className={`pip ${cardSuit} ace`}>
                                  {String.fromCharCode(thisSuit)}
                                </div>
                            )
                        }
                          
                        if (pip === "J" || pip === "Q" || pip === "K") {
                            return (
                              <div  className="picWrapper">
                                <div className={`${cardSuit} picCard ${pip} `}></div>
                              </div>
                            )
                        }
                        return null;
                      })
                    }
                  </Grid>
                </div>
              </div>
            </div> 
          )
          :
          <div className="cardBackWrapper" >
            <div className="cardBack"></div>
          </div>
        :
        (
          <div className="cardBackWrapper" >
            <div className="cardBack"></div>
          </div>
        )
      }
    </>
  )
}
export default PlayingCard;