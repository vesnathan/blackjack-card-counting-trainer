import './buttonBar.component.css';

import { useGameContext } from "../../utils/GameStateContext";

// Material UI Components
import Grid from '@mui/material/Grid';

// Custom Components
import Button from "../button/button.component";

interface ButtonObject {
  name: string,
  bgColor: string,
  buttonDisabled: boolean,
  type: string;
}
type ButtonBarProps = {
  buttons: Array<any>;
};

const ButtonBar = ({ buttons }: ButtonBarProps): React.ReactElement  => {

  const state: any = useGameContext();


  let buttonArray: React.ReactElement[] = [];
  buttons.forEach((button: ButtonObject) => {
    buttonArray.push(
    <Button 
      key={button.name} 
      buttonType={button.type} //"betButton"
      buttonString={button.name} 
      bgColor={button.bgColor} 
      buttonDisabled={button.buttonDisabled} 
    />);
  });
  return (
    <Grid  container justifyContent="center">
      <div className="buttonBar" >
        {buttonArray}
      </div>
    </Grid>
  );
}

export default ButtonBar;