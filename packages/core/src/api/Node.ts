import {
  BEBaseLocation,
  BEBaseNode,
  BELocation,
  BENodeMatch,
  BEPath,
} from '../interfaces';
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
   * Get a sub-node from a node at a given location
   * @param root node to be queried
   * @param loc location of sub-node to be retrieved
   * @returns node at the location
   */
  get<TResult extends TNode>(
    root: TNode,
    loc: BEPath | TLocation
  ): TResult | null {
    let node: TNode | null = root;
    let path: BEPath;

    if (BELocation.isLocation(loc)) {
      path = loc.path;
    } else {
      path = loc;
    }

    path = [...path];

    while (path.length && node) {
      const index = path.shift()!;

      node = this.kit.getChildAtIndex(node, index);
    }

    return node as TResult | null;
  }

  /**
   * Query the first node of the root node, or the node targeted by the at option.
   * @param root node to be queried
   * @param options options
   * @returns maybe, first node of the node in question
   */
  first<TResult extends TNode>(
    root: TNode,
    options: { at?: BEPath | TLocation; deep?: boolean } = {}
  ): TResult | null {
    const { at = [], deep = false } = options;

    let node = this.get(root, at);

    if (!node) {
      return null;
    }

    do {
      const tmp: TNode | null = this.kit.getChildAtIndex(node, 0);

      if (!tmp) {
        return node as TResult;
      } else {
        node = tmp;
      }
    } while (node && deep);

    return node as TResult | null;
  }

  /**
   * Query the last node of the root node, or the node targeted by the at option.
   * @param root node to be queried
   * @param options options
   * @returns maybe, last node of the node in question
   */
  last<TResult extends TNode>(
    root: TNode,
    options: { at?: BEPath | TLocation; deep?: boolean } = {}
  ): TResult | null {
    const { at = [], deep = false } = options;

    let node = this.get(root, at);

    if (!node) {
      return null;
    }

    do {
      const childCount = this.kit.getChildCount(node);

      if (childCount === null) {
        return node as TResult;
      } else {
        node = this.kit.getChildAtIndex(node, childCount - 1)!; // since we use the childCount, we can be sure that we WILL get a node
      }
    } while (node && deep);

    return node as TResult | null;
  }

  /**
   * Get the next sibling node from a location.
   * @param root node to be queried
   * @param loc location the next sibling should be retrieved from
   * @returns the next sibling of location, if existent
   */
  next<TResult extends TNode>(
    root: TNode,
    loc: BEPath | TLocation
  ): TResult | null {
    let path: BEPath;

    if (BELocation.isLocation(loc)) {
      path = loc.path;
    } else {
      path = loc;
    }

    const nextPath = BEPath.next(path);

    if (!nextPath) {
      return null;
    }

    return this.get(root, nextPath);
  }

  /**
   * Get the previous sibling node from a location.
   * @param root node to be queried
   * @param loc location, the previous sibling should be retrieved from
   * @returns the previous sibling of the provided location, if existent
   */
  prev<TResult extends TNode>(
    root: TNode,
    loc: BEPath | TLocation
  ): TResult | null {
    let path: BEPath;

    if (BELocation.isLocation(loc)) {
      path = loc.path;
    } else {
      path = loc;
    }

    const nextPath = BEPath.prev(path);

    if (!nextPath) {
      return null;
    }

    return this.get(root, nextPath);
  }

  /**
   * Query function to iterate over all children of a given node.
   * @param root node to be queried
   * @param options options
   * @returns a generator to iterate over all children
   */
  *children<TResult extends TNode>(
    root: TNode,
    options: { at?: BEPath | TLocation; reverse?: boolean } = {}
  ): Generator<[TResult, number]> {
    const { at = [], reverse = false } = options;

    const node = this.get(root, at);

    if (!node) {
      return;
    }

    const childCount = this.kit.getChildCount(node);

    if (childCount === null || this.kit.isLeaf(node)) {
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
      const child = this.kit.getChildAtIndex<TResult>(node, i);
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
