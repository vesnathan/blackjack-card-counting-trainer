import './shoe.component.css';

type AppProps = {
  numDecks: number;
  cardsDealt: number;
  dealerCutCard: number;
};


const Shoe = ({numDecks, cardsDealt, dealerCutCard}:AppProps): JSX.Element => {
  return (
    <div className="shoeWrapper">
      <div className="shoe">
        <div className="shoeCover"></div>
        <div className="decksHolder">       
          <div className="cutCard" style={{bottom: (((numDecks*52)-cardsDealt-dealerCutCard)/(4.16))+"%"}}></div>
          <div className="decks" style={{height: (((numDecks*52)-cardsDealt)/(4.16))+"%"}}></div>
          {/* 4.16 in the linbe above comes from 8 decks of cards 8 52 cards / 100 */}
        </div>
        <div className="shoeCardBack shoeCardBackOne"></div>
        <div className="shoeCardBack shoeCardBackTwo"></div> 
      </div>
    </div>
  );
}
  
export default Shoe;