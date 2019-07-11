import {Greeter} from '../src/greeter';
describe('FOO', () => {
    it('tests ts', () => {
        const greeter = new Greeter('folks');
        const message = greeter.greet();
        expect(message).toEqual('Howdy, folks');
    });
});
