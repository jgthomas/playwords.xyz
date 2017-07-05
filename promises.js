/* Basic implementation of promises
 *
 * generates a random number, and then calls either
 * resolve or reject depending on the result
 *
 */

function randomNumberMaker () {
    return new Promise( (resolve, reject) => {
        const randomNumber = Math.floor((Math.random() * 10) + 1);
        if (randomNumber <= 5) {
            resolve(randomNumber);
        } else {
            reject(randomNumber);
        }
    });
}


randomNumberMaker().then( (result) => {
    console.log(`Success: ${result}`);
}).catch( (error) => {
    console.log(`Error: ${error}`);
})
