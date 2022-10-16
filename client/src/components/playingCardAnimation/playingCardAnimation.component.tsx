import styled, { keyframes } from 'styled-components';

type PlayingCardAnimationProps = {
  posx: number;
  posy: number;
  offset: number;
  children: React.ReactNode;
};

const PlayingCardAnimation: any =
    styled.div<PlayingCardAnimationProps>`
      animation: ${(props) => dealCard(props)} .5s ;
      width: 8%;
      padding-bottom: 11%;
      position: absolute;
      right: ${(props) => (getX(props))}% ;
      top: ${(props) => getY(props)}% ;
    ` ;

const getX = (props: PlayingCardAnimationProps) => {
 return props.posx-(props.offset*1.5);
}
const getY = (props: PlayingCardAnimationProps) => {
  return props.posy-(props.offset*1.5);
 }
const dealCard = (props: PlayingCardAnimationProps) => keyframes`
      from {
        right: 15.5%;
        top: 11%;
        width: 5%;
        padding-bottom: 8%;
      }
      
      to {
        width: 8%;
        padding-bottom: 11%;
        right: ${props.posx-(props.offset*1.5)}%;
        top: ${props.posy-(props.offset*1.5)}%;

      }
   `;

export default PlayingCardAnimation;