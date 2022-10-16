import React from 'react';
import './swiperButton.component.css';
type AppProps = {
  buttonString: string;
  buttonPosition: string;
  swipperButtonHandler: Function;
};
const handleClick = (e: React.MouseEvent<HTMLElement>) => {
  
  const targetEl = (e.target as Element);
  const swipers = Array.from((document.getElementsByClassName("swiper") as HTMLCollectionOf<Element>));
  swipers.forEach((swiper: Element) => {
     swiper.classList.toggle("swiperHide");
   });
  (targetEl.parentNode as Element)!.classList.toggle("swiperHide");
  (targetEl.parentNode as Element)!.classList.toggle("swiperOpen");
}

const SwiperButton = ({ buttonString, buttonPosition, swipperButtonHandler }: AppProps): JSX.Element => {
  return (<div className={`swiperButton ${buttonPosition}`} onClick={(e) => { handleClick(e); swipperButtonHandler(buttonString); }}>{buttonString}</div>)
}
export default SwiperButton;
