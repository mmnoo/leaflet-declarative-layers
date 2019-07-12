import {Greeter} from '../src/greeter';
describe('importing TS modules', () => {
    it('can use imported code', () => {
        const greeter = new Greeter('folks');
        const message = greeter.greet();
        expect(message).toEqual('Howdy, folks');
    });
});
