describe('greeter', function(){
    it('returns the right greeting', function() {
        const greeter = new Greeter('folks');
        const message = greeter.greet();
        expect(message).toEqual('Howdy, folks');
    });
});