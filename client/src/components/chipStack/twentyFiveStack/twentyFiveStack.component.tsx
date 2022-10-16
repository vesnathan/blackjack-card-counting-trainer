import {ReactComponent as Chip} from "../../../assets/images/chip.svg";

type TwentyFiveStackProps = {
  betAmount: number;
};

const TwentyFiveStack = ({ betAmount }: TwentyFiveStackProps): JSX.Element  => {
  if (betAmount > 0) {
    return (<div className="twentyFive"><Chip /><div className="twentyFiveText">{betAmount}</div></div>);
  }
  return <div></div>
}

export default TwentyFiveStack;