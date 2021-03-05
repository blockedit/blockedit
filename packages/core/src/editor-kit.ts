import { BEBaseNode, BENode } from './interfaces/Node';
import { BEBaseElement, BEElement } from './interfaces/Element';
import { BEBaseLocation, BELocation, BEPath } from './interfaces';

export interface EditorKit<
  TNode extends BEBaseNode,
  TLocation extends BEBaseLocation
> {
  isLeaf: (node: TNode) => boolean;
  isElement: (node: TNode) => boolean;
  getStart: (node: TNode) => Omit<TLocation, 'path'>;
  getEnd: (node: TNode) => Omit<TLocation, 'path'>;
  getChildCount: (node: TNode) => number | null;
  getChildAtIndex: <TResult extends TNode>(
    node: TNode,
    index: number
  ) => TResult | null;
}

export function createEditorKit<
  TNode extends BEBaseNode,
  TLocation extends BEBaseLocation
>(): EditorKit<TNode, TLocation> {
  return {
    /**
     * Check, wether or not a node is considered to be a valid leaf node.
     * @param node node to-be-checked
     * @returns wether or not the node is considered to be a leaf node
     */
    isLeaf(node) {
      return !this.isElement(node) && BENode.isNode(node);
    },

    /**
     * Check, wether or not a node is considered to be a valid element.
     * @param node node to-be-checked
     * @returns wether or not the node is considered to be an element.
     */
    isElement(node) {
      return BEElement.isElement(node);
    },

    /**
     * Get the first location within a node. This excludes the path because we don't
     * know the path location of the given node within the document here
     * @param _node node to be queried
     * @returns the first location within a node
     */
    getStart(_node: TNode): Omit<TLocation, 'path'> {
      return {} as Omit<TLocation, 'path'>;
    },

    /**
     * Get the last location within a node. This excludes the path because we don't
     * know the path location of the given node within the document here.
     * @param _node node to be queried
     * @returns the last location within a node
     */
    getEnd(_node: TNode): Omit<TLocation, 'path'> {
      return {} as Omit<TLocation, 'path'>;
    },

    /**
     * Get the child of a node at a given index
     * @param node node to be queried
     * @param index index, of child to be queried
     * @returns the child at the given index or null
     */
    getChildAtIndex<TResult extends TNode>(
      node: TNode,
      index: number
    ): TResult | null {
      if (BEElement.isElement<TNode>(node)) {
        return (node.children[index] as TResult) || null;
      }

      return null;
    },

    /**
     * Query the count of children a node might have. The function returns 0 if there are simply no children but null, if the node
     * isn't meant to contain children.
     * @param node node to be queried
     * @returns the count of children or null, if the node doesn't have children
     */
    getChildCount(node) {
      if (BEElement.isElement<TNode>(node)) {
        return node.children.length;
      }

      return null;
    },
  };
}
