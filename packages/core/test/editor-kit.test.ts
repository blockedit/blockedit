import { CustomNode, editorKit } from './support/testEditorKit';

describe('The editor kit', () => {
  describe('isLeaf() function', () => {
    it('can identify valid leaf nodes', () => {
      const leafNode: CustomNode = {
        type: 'leaf',
      };

      expect(editorKit.isLeaf(leafNode)).toBeTruthy();
    });

    it('can identify invalid leaf nodes', () => {
      const nonLeafNode: CustomNode = {
        type: 'bar',
        children: [],
      };

      expect(editorKit.isLeaf(nonLeafNode)).toBeFalsy();
    });
  });

  describe('isElement() function', () => {
    it('can identify valid element nodes', () => {
      const elementNode: CustomNode = {
        type: 'bar',
        children: [],
      };

      expect(editorKit.isElement(elementNode)).toBeTruthy();
    });

    it('can identify invald element nodes', () => {
      const nonElementNode: CustomNode = {
        type: 'leaf',
      };

      expect(editorKit.isElement(nonElementNode)).toBeFalsy();
    });
  });

  describe('getStart() function', () => {
    it('can determine the start location of a node', () => {
      // the start location will be an empty object because we omit the path and there's only one position for base nodes

      const node: CustomNode = {
        type: 'bar',
        children: [],
      };

      expect(editorKit.getStart(node)).toMatchObject({});
    });
  });

  describe('getEnd() function', () => {
    it('can determine the end location of a node', () => {
      // the end location will be an empty object because we omit the path and there's only one position for base nodes

      const node: CustomNode = {
        type: 'bar',
        children: [],
      };

      expect(editorKit.getEnd(node)).toMatchObject({});
    });
  });

  describe('getChildCount() function', () => {
    it('can determine the number of children of a node', () => {
      const node: CustomNode = {
        type: 'bar',
        children: [{ type: 'leaf' }, { type: 'leaf' }, { type: 'leaf' }],
      };

      expect(editorKit.getChildCount(node)).toEqual(3);
    });

    it('can detect element nodes with no children', () => {
      const node: CustomNode = {
        type: 'bar',
        children: [],
      };

      expect(editorKit.getChildCount(node)).toEqual(0);
    });

    it("can detect nodes, that don't support children", () => {
      const node: CustomNode = {
        type: 'leaf',
      };

      expect(editorKit.getChildCount(node)).toEqual(null);
    });
  });
});
