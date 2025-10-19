import './main';

describe('Main entry point', () => {
  it('should load without throwing errors', () => {
    // If importing main.ts causes an exception, this test will fail.
    expect(true).toBeTrue();
  });
});