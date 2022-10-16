import {ReactComponent as Chip} from "../../../assets/images/chip.svg";

type FiftyStackProps = {
  betAmount: number;
};

const FiftyStack = ({ betAmount }: FiftyStackProps): JSX.Element  => {
  if (betAmount > 0) {
    return (<div className="fifty"><Chip /><div className="fiftyText">{betAmount}</div></div>);
  }
  return <div></div>
}

export default FiftyStack;