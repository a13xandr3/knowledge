import { FileRef, FilesPayload } from './file-ref.model';

describe('FileRef model', () => {
  it('should allow creation of a FileRef object', () => {
    const ref: FileRef = { id: 1, filename: 'example.txt' };
    expect(ref.id).toBe(1);
    expect(ref.filename).toBe('example.txt');
  });

  it('should accept arrays of FileRefs in FilesPayload', () => {
    const payload: FilesPayload = { files: [{ id: 2, filename: 'sample.pdf' }] };
    expect(payload.files.length).toBe(1);
    expect(payload.files[0].filename).toContain('sample');
  });
});