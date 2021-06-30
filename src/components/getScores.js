/* eslint-disable */

const getScores = async () => {
    const id = 'ylaQJIceB2zpscPcvxIj';
    try {
      const result = await fetch("https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/"+id+"/scores/",
        {
            mode: 'cors'
        }
      );

      const response = await result.json();
      return response.result;

    } 
    catch (e) {
      return e;
    }

}



// const getScores = (id) => {
    
//     fetch("https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/"+id+"/scores/",
//     {
//         mode: 'cors'
//     })
//     .then(function(response) {
//     return response.json();
//     })
//     .then(function(response) {
//     return response.result;
//     })
//     .catch(e => {
//     return e;
//     });
// }


export default getScores