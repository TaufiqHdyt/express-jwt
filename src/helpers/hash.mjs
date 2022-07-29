import crypto from 'node:crypto';

class HASH {
  #suffix;
  #prefix;

  constructor(prefix = 'prefix', suffix = 'suffix') {
    this.#prefix = prefix;
    this.#suffix = suffix;
  }

  getHash = (text, algorithm) => {
    const hash = crypto.createHash(algorithm);
    hash.update(`${this.#prefix}${text}${this.#suffix}`);
    return hash.digest('hex');
  };

  sha256 = (text) => this.getHash(text, 'sha256');

  randomString = (length = 16, encoding = 'hex') => {
    return crypto.randomBytes(length).toString(encoding);
  };

  randomNumber = (length = 12) =>
    crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length));
}

export default new HASH();
