import './tableMessage.component.css';
 
type TableMessageProps = {
  tableMessage?: string;
}
 
const TableMessage = ({tableMessage}: TableMessageProps): JSX.Element => {
  return (
    <div className="tableMessageDiv" >{tableMessage}</div>
  )
}
 
export default TableMessage;