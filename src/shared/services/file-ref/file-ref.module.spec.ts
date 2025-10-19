import { FileRefModule } from './file-ref.module';

describe('FileRefModule', () => {
  it('should instantiate the module', () => {
    const module = new FileRefModule();
    expect(module).toBeTruthy();
  });
});