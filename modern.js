
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

  then(fHandler){
    fHandler = fHandler ?? (x => x);

    return new Vow((resolve, reject) => {
      const fWrapper = () => {
        const value = fHandler(this.#result);
        value instanceof Vow ? value.then(resolve) : resolve(value);
      }
      
      if(this.#state === "pending"){
        this.#fQueue.push(fWrapper);
        return;
      }

      if(this.#state === "fulfilled"){
        setTimeout(fWrapper);
        return;
      }
    })
  }
}
