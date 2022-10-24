export const BET_BUTTONS = () => {
  const betButtonsArray: any = [
    { name: "5",    bgColor: "bg-color-1", buttonDisabled: false, type: "betButton" },
    { name: "25",   bgColor: "bg-color-2", buttonDisabled: false, type: "betButton" },
    { name: "50",   bgColor: "bg-color-3", buttonDisabled: false, type: "betButton" },
    { name: "DEAL", bgColor: "bg-color-4", buttonDisabled: true,  type: "betButton" },
    { name: "AUTO", bgColor: "bg-color-0", buttonDisabled: false,  type: "betButton" },
  ];
  return betButtonsArray;
}