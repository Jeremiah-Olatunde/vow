
class Vow {
  #state = "pending";
  #result = undefined;

  #fQueue = [];
  #rQueue = [];

  constructor(executor){
    try {
      executor(this.resolve, this.reject);
    } catch(error){
      this.reject(error);
    }
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

  then(fHandler, rHandler){
    return new Vow((resolve, reject) => {
      const fWrapper = () => {
        if(fHandler){
          try {
            const value = fHandler(this.#result);
            value instanceof Vow ? value.then(resolve, reject) : resolve(value);
          } catch(error) {
            reject(error);
          }

          return;
        }

        resolve(this.#result);
      }

      const rWrapper = () => {
        if(rHandler){
          try {
            const value = rHandler(this.#result);
            value instanceof Vow ? value.then(resolve, reject) : resolve(value);
          } catch(error){
            reject(error);
          }

          return;
        }
        
        reject(this.#result);
      }      
      
      if(this.#state === "pending"){
        this.#fQueue.push(fWrapper);
        this.#rQueue.push(rWrapper);
        return;
      }

      if(this.#state === "fulfilled"){
        setTimeout(fWrapper);
        return;
      }

      if(this.#state === "rejected"){
        setTimeout(rWrapper);
        return;
      }      
    })
  }
}
