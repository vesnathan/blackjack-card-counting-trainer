import './playerHandResult.component.css';
 
type PlayerHandResultProps = {
  playerHandResult?: string;
  playerPosition: Array<number>;
  positionAdjust: Array<number>;
}
 
const App = ({playerHandResult, playerPosition, positionAdjust}: PlayerHandResultProps): JSX.Element => {
  return (
    <div className="playerHandResultDiv" style={{right: (playerPosition[0]-positionAdjust[0])+"%", top: (playerPosition[1]+positionAdjust[1])+"%"}}>{playerHandResult}</div>
  )
}
 
export default App;