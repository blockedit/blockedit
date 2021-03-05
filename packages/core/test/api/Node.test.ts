import { BENodeAPI } from '../../src';
import {
  CustomNode,
  CustomLocation,
  editorKit,
} from '../support/testEditorKit';

const NodeAPI = new BENodeAPI<CustomNode, CustomLocation, typeof editorKit>(
  editorKit
);

describe('the Node API', () => {
  describe('children() function', () => {
    it('returns an iterateable with all children of a node', () => {
      const node: CustomNode = {
        type: 'bar',
        children: [
          { type: 'leaf', text: 'a' },
          { type: 'leaf', text: 'b' },
        ],
      };

      const children = Array.from(NodeAPI.children(node));
      expect(children).toMatchObject([
        [{ type: 'leaf', text: 'a' }, 0],
        [{ type: 'leaf', text: 'b' }, 1],
      ]);
    });

    it('can return the children backwards', () => {
      const node: CustomNode = {
        type: 'bar',
        children: [
          { type: 'leaf', text: 'a' },
          { type: 'leaf', text: 'b' },
        ],
      };

      const children = Array.from(NodeAPI.children(node, { reverse: true }));
      expect(children).toMatchObject([
        [{ type: 'leaf', text: 'b' }, 1],
        [{ type: 'leaf', text: 'a' }, 0],
      ]);
    });

    it('returns an empty iterateable if a node has no children', () => {
      const node: CustomNode = {
        type: 'bar',
        children: [],
      };

      const children = Array.from(NodeAPI.children(node));
      expect(children).toMatchObject([]);
    });

    it("returns an empty iterateable if a node doesn't support children", () => {
      const node: CustomNode = {
        type: 'leaf',
      };

      const children = Array.from(NodeAPI.children(node));
      expect(children).toMatchObject([]);
    });
  });

  describe('nodes() function', () => {
    it('returns an iterateable with all recursive children of a node', () => {
      const node = {
        type: 'bar',
        children: [
          {
            type: 'foo',
            children: [
              { type: 'leaf', text: 'a' },
              { type: 'leaf', text: 'b' },
            ],
          },
          { type: 'leaf', text: 'c' },
          { type: 'leaf', text: 'd' },
        ],
      };

      const children = Array.from(NodeAPI.nodes(node as CustomNode));
      expect(children).toMatchObject([
        [node.children[0]?.children?.[0], [0, 0]],
        [node.children[0]?.children?.[1], [0, 1]],
        [node.children[0], [0]],
        [node.children[1], [1]],
        [node.children[2], [2]],
        [node, []],
      ]);
    });

    it('returns an iterateable with all recursive children of a node backwards', () => {
      const node = {
        type: 'bar',
        children: [
          {
            type: 'foo',
            children: [
              { type: 'leaf', text: 'a' },
              { type: 'leaf', text: 'b' },
            ],
          },
          { type: 'leaf', text: 'c' },
          { type: 'leaf', text: 'd' },
        ],
      };

      const children = Array.from(
        NodeAPI.nodes(node as CustomNode, { reverse: true })
      );
      expect(children).toMatchObject([
        [node.children[2], [2]],
        [node.children[1], [1]],
        [node.children[0]?.children?.[1], [0, 1]],
        [node.children[0]?.children?.[0], [0, 0]],
        [node.children[0], [0]],
        [node, []],
      ]);
    });

    it('can only match certain nodes', () => {
      const node = {
        type: 'bar',
        children: [
          {
            type: 'foo',
            children: [
              { type: 'leaf', text: 'a' },
              { type: 'leaf', text: 'b' },
            ],
          },
          { type: 'leaf', text: 'c' },
          { type: 'leaf', text: 'd' },
        ],
      };

      const children = Array.from(
        NodeAPI.nodes(node as CustomNode, { match: n => n.type === 'leaf' })
      );
      expect(children).toMatchObject([
        [node.children[0]?.children?.[0], [0, 0]],
        [node.children[0]?.children?.[1], [0, 1]],
        [node.children[1], [1]],
        [node.children[2], [2]],
      ]);
    });
  });
});
