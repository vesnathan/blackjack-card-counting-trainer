export const PLAY_BUTTONS = () => {
  const playButtonsArray: any = [
    { name: "HIT",    bgColor: "bg-color-1", buttonDisabled: false, type: "playButton" },
    { name: "STAND",  bgColor: "bg-color-1", buttonDisabled: false, type: "playButton" },
    { name: "DOUBLE", bgColor: "bg-color-1", buttonDisabled: true,  type: "playButton" },
    { name: "SPLIT",  bgColor: "bg-color-1", buttonDisabled: true, type: "playButton" },
    { name: "TIP",    bgColor: "bg-color-1", buttonDisabled: false, type: "playButton" },
  ];
  return playButtonsArray;
}