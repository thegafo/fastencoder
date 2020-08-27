
const { read, write } = require('./file');
const math = require('mathjs');

class FastEncoder {
    constructor(path) {
        this.path = path;
    }

    /**
     * 
     * @param {type} path 
     */
    async load(path) {
        path = path || this.path;
        var data = await read(path);
        return this.loadString(data);
    }

    /**
     * 
     * @param {type} str 
     */
    loadString(str) {
        var data = str.split('\n').slice(10).map(d => {
            d = d.split(' ');
            return {
                word: d[0],
                vector: d.slice(1, 301).map(x => parseFloat(x))
            }
        }).filter(d => d.word && d.vector && d.vector.length == 300);
        var vectors = {};
        for (var d of data) vectors[d.word] = this.normalize(d.vector);
        this.data = vectors;
        return vectors;
    }

    /**
     * normalize - description
     *
     * @param  {type} a description
     * @return {type}   description
     */
    normalize(a) {
        var n = Math.sqrt(this.dot(a, a));
        return a.map(x => x / n);
    }

    /**
     * dot - description
     *
     * @param  {type} a description
     * @param  {type} b description
     * @return {type}   description
     */
    dot(a, b) {
        return math.dot(math.matrix(a), math.matrix(b));
    }

    /**
     * 
     * @param {type} a 
     * @param {type} b 
     */
    add(a, b) {
        var result = a.map((x, index) => {
            return x + b[index]
        });
        return result;
    }

    /**
     * getVector - description
     *
     * @param  {type} word description
     * @return {type}      description
     */
    getVector(word) {
        if (!this.data) throw new Error('Data not loaded');
        return this.data[word] || null;
    }

    /**
     * getSentenceVector - get "estimated" sentence vector by computing average
     * of all word embeddings in a sentence
     *
     * @param  {type} sentence description
     * @return {type}          description
     */
    getSentenceVector(sentence) {
        var words = sentence.toLowerCase().split(' ');
        var result = new Array(300).fill(0);
        var count = 0;
        for (var w of words) {
            var v = this.getVector(w);
            if (!v) continue;
            result = this.add(result, v);
            count++;
        }
        for (var r of result) r /= (1.0 * count);
        return result;
    }

    /**
     * 
     * @param {*} text 
     */
    encode(text) {
        if (text.includes(' ')) {
            return this.getSentenceVector(text);
        } else {
            return this.getVector(text);
        }
    }

    /**
     * getSimilar - description
     *
     * @param  {type} word description
     * @param  {type} k    description
     * @return {type}      description
     */
    getSimilar(word, k) {
        if (!(word in this.data)) return false;
        var results = [];
        for (var w in this.data) {
            results.push([w, this.dot(this.data[w], this.data[word])]);
        }
        results = results.sort((a, b) => b[1] - a[1]);
        return results.slice(0, k || 10);
    }

}

module.exports = FastEncoder;