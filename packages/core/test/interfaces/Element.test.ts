import { BEElement } from '@blockedit/core';

describe('The Element interface', () => {
  it('can identify element nodes', () => {
    const possibleElement = {
      test: 'blah',
      children: [],
    };
    const possibleElement2 = {
      test: 'blah',
    };

    expect(BEElement.isElement(possibleElement)).toEqual(true);
    expect(BEElement.isElement(possibleElement2)).toEqual(false);
  });
});
