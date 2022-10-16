import React from 'react';
import './userScoreMessage.component.css';

type UserScoreMessageProps = {
  userScoreMessage: number;
  position: Array<number>;
};


const UserScoreMessage = ({ userScoreMessage, position }: UserScoreMessageProps): JSX.Element => {
  return (<div className={(userScoreMessage < 0)?"negative userScoreMessage":"positive userScoreMessage"}  style={{top: position[1]+"%", right: position[0]+"%"}}>{userScoreMessage}</div>)
}
export default UserScoreMessage;
