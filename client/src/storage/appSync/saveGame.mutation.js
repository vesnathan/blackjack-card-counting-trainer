import { useMutation } from "react-query";
import {  GRAPHQL_URL } from "../../config/aws.config";

const useSaveGame = () => {
  useMutation(
    (post) => {
      fetch(GRAPHQL_URL, {
        body: JSON.stringify(post),
        method: "POST",
      })
    },
    {
      onSuccess: () => { console.log("Saved")},
    },
    {
      onError: (err) => { console.log(err)},
    },
  );
}

export default useSaveGame;

