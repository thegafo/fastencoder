

let Encoder = require('.');

(async () => {

    let encoder = new Encoder();

    console.log('Encoder loading');

    await encoder.load('./wiki-50k.vec');

    console.log('Encoder loaded');

    let vector = encoder.encode('hello');
    console.log(vector.length);

    let similar = encoder.getSimilar('hello', 3);
    console.log(similar);


})();