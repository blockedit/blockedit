import { BEPath, BESpan } from '../../src';

describe('the path path helper', () => {
  it('Path.isPath() verifies paths', () => {
    const correctPath: any = [1, 2];
    const wrongPath: any = 'test';

    expect(BEPath.isPath(correctPath)).toBeTruthy();
    expect(BEPath.isPath(wrongPath)).toBeFalsy();
  });

  it('Path.equals() checks, if paths are equal', () => {
    const p1: BEPath = [0, 1, 2];
    const p2: BEPath = [0, 1, 2];

    const wrongPath: BEPath = [2, 2, 2];

    expect(BEPath.equals(p1, p2)).toBeTruthy();
    expect(BEPath.equals(p1, wrongPath)).toBeFalsy();
  });

  it('Path.isBefore() checks, if a path comes before another', () => {
    const path: BEPath = [0, 3, 4];
    const another: BEPath = [1, 2, 3];

    expect(BEPath.isBefore(path, another)).toBeTruthy();
    expect(BEPath.isBefore(another, path)).toBeFalsy();

    const equalPath = [0, 1, 2, 3];
    expect(BEPath.isBefore(equalPath, equalPath)).toBeTruthy();
  });

  it('Path.isAfter() checks, if a path comes after another', () => {
    const path: BEPath = [1, 2, 3];
    const another: BEPath = [0, 3, 4];

    expect(BEPath.isAfter(path, another)).toBeTruthy();
    expect(BEPath.isAfter(another, path)).toBeFalsy();

    const equalPath = [0, 1, 2, 3];
    expect(BEPath.isAfter(equalPath, equalPath)).toBeTruthy();
  });

  it('Path.isWithin() checks, if a path is within a span', () => {
    const path: BEPath = [1, 1];
    const range: BESpan = [
      [0, 0],
      [2, 0],
    ];

    const randomPath: BEPath = [3, 0];

    expect(BEPath.isWithin(path, range)).toBeTruthy();
    expect(BEPath.isWithin(randomPath, range)).toBeFalsy();
  });

  it('Path.first() returns the path to be first', () => {
    const p1: BEPath = [0, 1];
    const p2: BEPath = [1, 0];

    const expectedResult = p1;
    expect(BEPath.first(p1, p2)).toMatchObject(expectedResult);
    expect(BEPath.first(p2, p1)).toMatchObject(expectedResult);
  });

  it('Path.last() returns the path to be last', () => {
    const p1: BEPath = [0, 1];
    const p2: BEPath = [1, 0];

    const expectedResult = p2;
    expect(BEPath.last(p1, p2)).toMatchObject(expectedResult);
    expect(BEPath.last(p2, p1)).toMatchObject(expectedResult);
  });

  it('Path.parent() returns a childs parent path', () => {
    expect(BEPath.parent([])).toMatchObject([]);
    expect(BEPath.parent([1])).toMatchObject([]);
    expect(BEPath.parent([1, 2])).toMatchObject([1]);
  });
});
