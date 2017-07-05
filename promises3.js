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


get('http://127.0.0.1:5000/anagram').then( (result) => {
    const data = JSON.parse(result);
    console.log(data);
}).catch( (error) => {
    console.log(error);
})
