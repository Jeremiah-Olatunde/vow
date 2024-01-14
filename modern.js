
class Vow {
  #state = "pending";
  #result = undefined;

  #fQueue = [];
  #rQueue = [];

  constructor(executor){
    executor(this.resolve, this.reject);
  }

  resolve = (result) => {
    this.#state = "fulfilled";
    this.#result = result; 
    setTimeout(() => this.#fQueue.forEach(handler => handler()));
  }

  reject = (error) => {
    this.#state = "rejected";
    this.#result = error;
    setTimeout(() => this.#rQueue.forEach(handler => handler()));
  }
}
