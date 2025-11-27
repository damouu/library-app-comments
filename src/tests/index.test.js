describe('Test Environment Setup', () => {

    // A test case that asserts a true statement is true.
    // This is often called a "smoke test" or "sanity check."
    test('should assert that true is equal to true', () => {
        // Jest's expect function is used to wrap a value (true)
        // and chain it with a matcher (toBe(true)).
        expect(true).toBe(true);
    });

    // You can also test simple arithmetic to be sure logic is executing
    test('should check basic arithmetic is correct', () => {
        expect(1 + 1).toBe(2);
    });
});