class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Howdy, " + this.greeting;
    }
}

let greeter = new Greeter("world");