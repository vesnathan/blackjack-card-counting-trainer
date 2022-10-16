import React from 'react';
import './tableOverlay.component.css';
type AppProps = {
  message: string;
  messageSizeClass: string;
};
const TableOverlay = ({ message, messageSizeClass }: AppProps): JSX.Element => {
  return (
    <div id="overlays">
      <div className={`tableOverlay ${messageSizeClass}`}>
        <svg viewBox="0 0 1080 100">
          <path id="curve" d="M153.571,41.41c8.493,2.314,139.052,36.732,379.157,36.276 c236.284-0.453,362.599-34.265,371.728-36.808" />
          <text width="1080">
            <textPath href="#curve">
              {message}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  )
}
  
export default TableOverlay;
