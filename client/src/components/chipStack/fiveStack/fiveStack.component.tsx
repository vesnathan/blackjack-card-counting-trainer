import {ReactComponent as Chip} from "../../../assets/images/chip.svg";

type FiveStackProps = {
  betAmount: number;
};

const FiveStack = ({ betAmount }: FiveStackProps): JSX.Element  => {
  if (betAmount > 0) {
    return (<div className="five"><Chip /><div className="fiveText">{betAmount}</div></div>);
  }
  return <div></div>
}

export default FiveStack;