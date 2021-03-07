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
  describe('get() function', () => {
    const node: CustomNode = {
      type: 'bar',
      children: [
        {
          type: 'foo',
          children: [
            { type: 'leaf', text: 'a' },
            { type: 'leaf', text: 'b' },
          ],
        },
        { type: 'foo', children: [{ type: 'leaf', text: 'c' }] },
      ],
    };

    it('can fetch a node by path', () => {
      const nodeAtPath = NodeAPI.get(node, [0, 1]);
      expect(nodeAtPath).toMatchObject({ type: 'leaf', text: 'b' });
    });

    it('can fetch a node by location', () => {
      const nodeAtPath = NodeAPI.get(node, { path: [1, 0] });
      expect(nodeAtPath).toMatchObject({ type: 'leaf', text: 'c' });
    });

    it("returns null, if the location doesn't exist", () => {
      const nodeAtPath = NodeAPI.get(node, [2, 0]);
      expect(nodeAtPath).toEqual(null);
    });
  });

  describe('first() function', () => {
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
        { type: 'foo', children: [{ type: 'leaf', text: 'c' }] },
      ],
    };

    it('can fetch the first node of the root', () => {
      const first = NodeAPI.first(node as CustomNode);
      expect(first).toMatchObject(node.children[0]);
    });

    it('can fetch the first leaf node of the root', () => {
      const first = NodeAPI.first(node as CustomNode, { deep: true });
      expect(first).toMatchObject(node.children[0].children[0]);
    });

    it('can fetch the first node of a child node', () => {
      const first = NodeAPI.first(node as CustomNode, { at: [1] });
      expect(first).toMatchObject(node.children[1].children[0]);
    });
  });

  describe('last() function', () => {
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
        { type: 'foo', children: [{ type: 'leaf', text: 'c' }] },
      ],
    };

    it('can fetch the last node of the root', () => {
      const last = NodeAPI.last(node as CustomNode);
      expect(last).toMatchObject(node.children[1]);
    });

    it('can fetch the last leaf node of the root', () => {
      const last = NodeAPI.last(node as CustomNode, { deep: true });
      expect(last).toMatchObject(node.children[1].children[0]);
    });

    it('can fetch the last node of a child node', () => {
      const last = NodeAPI.last(node as CustomNode, { at: [0] });
      expect(last).toMatchObject(node.children[0].children[1]);
    });
  });

  describe('next() function', () => {
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
        { type: 'foo', children: [{ type: 'leaf', text: 'c' }] },
      ],
    };

    it('returns the next sibling for a given path', () => {
      expect(NodeAPI.next(node as CustomNode, [0, 0])).toMatchObject(
        node.children[0].children[1]
      );
    });

    it('returns the next sibling for a given location', () => {
      expect(NodeAPI.next(node as CustomNode, { path: [0, 0] })).toMatchObject(
        node.children[0].children[1]
      );
    });

    it('returns null for non-existent sibling nodes', () => {
      expect(NodeAPI.next(node as CustomNode, [1])).toEqual(null);
    });
  });

  describe('prev() function', () => {
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
        { type: 'foo', children: [{ type: 'leaf', text: 'c' }] },
      ],
    };

    it('returns the previous sibling for a given path', () => {
      expect(NodeAPI.prev(node as CustomNode, [0, 1])).toMatchObject(
        node.children[0].children[0]
      );
    });

    it('returns the previous sibling for a given location', () => {
      expect(NodeAPI.prev(node as CustomNode, { path: [0, 1] })).toMatchObject(
        node.children[0].children[0]
      );
    });

    it('returns null for non-existent sibling nodes', () => {
      expect(NodeAPI.prev(node as CustomNode, [0])).toEqual(null);
    });
  });

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
