/* Basic promises with AJAX request
 *
 * makes a call to a server and then logs the 
 * resulting data or error message to the console
 *
 */

function get(url) {
    return new Promise( (resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = () => {
            if (req.status === 200) {
                resolve(req.response);
            } else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = () => {
            reject(Error("Network Error"));
        };
        req.send();
    });
}
     

get('https://codepen.io/eclairereese/pen/BzQBzR.html')
  .then( (result) => {
    console.log(result);
}).catch( (error) => {
    console.log(error);
})
