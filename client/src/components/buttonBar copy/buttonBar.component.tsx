import './buttonBar.component.css';

// Material UI Components
import Grid from '@mui/material/Grid';

// Custom Components
import Button from "../button/button.component";

interface ButtonObject {
  name: string,
  bgColor: string,
  buttonDisabled: boolean,
}
type ButtonBarProps = {
  buttons: Array<any>;
  setBetAmount: Function;
  playButtonsProcess: Function;
};

const ButtonBar = ({ buttons, playButtonsProcess }: ButtonBarProps): React.ReactElement  => {
  let buttonArray: React.ReactElement[] = [];
  buttons.forEach((button: ButtonObject) => {
    buttonArray.push(
    <Button 
      key={button.name} 
      buttonString={button.name} 
      bgColor={button.bgColor} 
      buttonDisabled={button.buttonDisabled} 
      buttonType="playButton"
    />);
  });
  return <Grid  container justifyContent="center"><div className="buttonBar" >{buttonArray}</div></Grid>
}

export default ButtonBar;