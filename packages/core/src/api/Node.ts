import {
  BEBaseElement,
  BEBaseLocation,
  BEBaseNode,
  BENodeMatch,
  BEPath,
} from 'src/interfaces';
import { EditorKit } from '../editor-kit';

/**
 * API to query any node.
 * Requires an EditorKit to be able to account for potential special behaviors of certain nodes
 */
export class BENodeAPI<
  TNode extends BEBaseNode,
  TLocation extends BEBaseLocation,
  T extends EditorKit<TNode, TLocation>
> {
  private kit: T;

  constructor(kit: T) {
    this.kit = kit;
  }

  /**
   * Query function to iterate over all children of a given node.
   * @param root node to be queried
   * @param options options
   * @returns a generator to iterate over all children
   */
  *children<TResult extends TNode>(
    root: TNode,
    options: { reverse?: boolean } = {}
  ): Generator<[TResult, number]> {
    const { reverse = false } = options;

    const childCount = this.kit.getChildCount(root);

    if (childCount === null || this.kit.isLeaf(root)) {
      return;
    }

    let i = 0,
      finish = childCount,
      direction = 1;

    if (reverse) {
      direction = -1;
      i = childCount - 1;
      finish = -1;
    }

    for (; i !== finish; i += direction) {
      const child = this.kit.getChildAtIndex<TResult>(root, i);
      if (child !== null) {
        yield [child, i];
      }
    }
  }

  /**
   * Query function to iterate over the whole tree of matching children of a given node.
   * @param root node to be queried
   * @param options options
   * @returns a generator to iterate over all matching nodes.
   */
  *nodes<TResult extends TNode>(
    root: TNode,
    options: { reverse?: boolean; match?: (node: TNode) => boolean } = {}
  ): Generator<BENodeMatch<TResult>> {
    const { reverse = false, match = () => true } = options;
    const self = this;

    function* recursor(
      node: TNode,
      rootPath: BEPath
    ): Generator<BENodeMatch<TResult>> {
      for (const [child, index] of self.children(node, { reverse })) {
        const childPath = rootPath.concat(index);

        for (const match of recursor(child, childPath)) {
          yield match;
        }
      }

      if (match(node)) {
        yield [node as TResult, rootPath];
      }
    }

    for (const match of recursor(root, [])) {
      yield match;
    }
  }
}
