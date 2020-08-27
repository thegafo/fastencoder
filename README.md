## fastencoder

> Use pretrained fasttext models to generate word and sentence embeddings.


## Data

Download word embeddings [here](https://fasttext.cc/docs/en/english-vectors.html).

Create `data.vec` to be used by application:
```bash
head -n 50000 `filename`.vec > data.vec
```

## Usage

```javascript
let FastEncoder = require('fastencoder');

(async () => {

    // Instantiate and load encoder
    let encoder = new FastEncoder();
    await encoder.load('./data.vec');

    // Get word/sentence embedding
    let vector = encoder.encode('hello');
    console.log(vector.length);

    // Get most similar words
    let similar = encoder.getSimilar('hello', 3);
    console.log(similar);

})();

```