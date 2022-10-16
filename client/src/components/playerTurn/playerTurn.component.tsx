import PlayButtonImage from "../../assets/images/play.gif";

import './playerTurn.component.css';

type PlayerTurnProps = {
  playerPosition: Array<number>;
};

const PlayerTurn = ({playerPosition}: PlayerTurnProps): JSX.Element => {
  return (
    <div className="playerTurn" style={{right: (playerPosition[0]-3)+"%", top: (playerPosition[1]+20)+"%"}}><img src={PlayButtonImage} alt="" /></div>
  )
}
 
export default PlayerTurn;