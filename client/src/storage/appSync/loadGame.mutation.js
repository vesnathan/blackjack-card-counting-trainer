import { useMutation } from "react-query";
import {  GRAPHQL_URL } from "../../config/aws.config";


const useLoadGame = () => {
  useMutation(
    (post) => {
      fetch(GRAPHQL_URL, {
        body: JSON.stringify(post),
        method: "POST",
      })
    },
    {
      onSuccess: () => { },
    },
    {
      onError: (err) => { console.log(err)},
    },
  );
}

export default useLoadGame;