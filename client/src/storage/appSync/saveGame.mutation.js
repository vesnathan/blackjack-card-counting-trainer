import { useMutation } from "react-query";
import {  API_URL } from "../../config/aws.config";

const useSaveGame = () => {
  useMutation(
    (post) => {
      fetch(API_URL, {
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



// import { gql } from "graphql-request";

// export const saveGame = gql`
// mutation AddExpense($data: ExpenseInsertInput!) {
//   insertOneExpense(data: $data) {
//     _id
//   }
// }
// `;