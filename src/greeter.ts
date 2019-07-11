export class Greeter {
    public greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    public greet() {
        return 'Howdy, ' + this.greeting;
    }
}
