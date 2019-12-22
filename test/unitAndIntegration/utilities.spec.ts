import {defaultBooleanToTrue} from '../../src/utilities'
describe('utilities module', () => {
    describe('defaultToTrue fucntion', () => {
        it('converts undefined to true', () => {
            expect(defaultBooleanToTrue(undefined)).toEqual(true);
        })
        it('retains false as false', () => {
            expect(defaultBooleanToTrue(false)).toEqual(false);
        })
        it('converts null to true', () => {
            expect(defaultBooleanToTrue(null)).toEqual(true);
        })
        
    })
})
