import './polyfills';

describe('Polyfills', () => {
  it('should load polyfills file without throwing errors', () => {
    // The presence of this import ensures that the polyfills file executes.
    expect(true).toBeTrue();
  });
});