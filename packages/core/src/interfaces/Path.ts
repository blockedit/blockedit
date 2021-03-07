export type BEPath = Array<number>;

export type BESpan = [BEPath, BEPath];

export const BESpan = {
  isSpan(span: any): span is BESpan {
    return (
      Array.isArray(span) &&
      span.length === 2 &&
      BEPath.isPath(span[0]) &&
      BEPath.isPath(span[1])
    );
  },
};

export const BEPath = {
  isPath(path: any): path is BEPath {
    return (
      Array.isArray(path) && (path.length === 0 || typeof path[0] === 'number')
    );
  },

  /**
   * Check, if child is a child of root.
   * @param root root path
   * @param child child path
   */
  isChild(root: BEPath, child: BEPath): boolean {
    if (root.length >= child.length) {
      return false;
    }

    for (const [index, pathIndex] of root.entries()) {
      if (pathIndex !== child[index]) {
        return false;
      }
    }
    return true;
  },

  /**
   * Check if 2 paths are equal.
   * @param p1 path
   * @param p2 path
   */
  equals(p1: BEPath, p2: BEPath): boolean {
    if (p1.length !== p2.length) {
      false;
    }

    for (let i = 0; i < p1.length; i++) {
      if (p1[i] !== p2[i]) {
        return false;
      }
    }
    return true;
  },

  /**
   * Check, if path is before another.
   * @param path reference path
   * @param another path to be chcked
   */
  isBefore(path: BEPath, another: BEPath): boolean {
    const len = Math.min(path.length, another.length);

    for (let i = 0; i < len; i++) {
      if (path[i] < another[i]) {
        return true;
      }

      if (path[i] > another[i]) {
        return false;
      }
    }

    // be inclusive for equal paths
    return true;
  },

  /**
   * Check, if path is after another
   * @param path path to be checked
   * @param another reference path
   */
  isAfter(path: BEPath, another: BEPath): boolean {
    const len = Math.min(path.length, another.length);

    for (let i = 0; i < len; i++) {
      if (path[i] > another[i]) {
        return true;
      }

      if (path[i] < another[i]) {
        return false;
      }
    }

    // be inclusive for equal paths
    return true;
  },

  /**
   * Check which path is the one to come first
   * @param p1 path
   * @param p2 path
   */
  first(p1: BEPath, p2: BEPath): BEPath {
    if (BEPath.isBefore(p1, p2)) {
      return p1;
    }

    return p2;
  },

  /**
   * Check which path is the one to come last
   * @param p1 path
   * @param p2 path
   */
  last(p1: BEPath, p2: BEPath): BEPath {
    if (BEPath.isAfter(p1, p2)) {
      return p1;
    }

    return p2;
  },

  /**
   * Get the next possible path at the lowest level
   * @param path path
   * @returns the next possible path
   */
  next(path: BEPath): BEPath | null {
    const p = [...path];
    const index = p.pop();

    if (index === undefined) {
      return null;
    }

    return p.concat(index + 1);
  },

  /**
   * Get the previous possible path at the lowest level
   * @param path path
   * @returns the previous path
   */
  prev(path: BEPath): BEPath | null {
    const p = [...path];
    const index = p.pop();

    if (index === undefined) {
      return null;
    }

    if (index <= 0) {
      return null;
    }

    return p.concat(index - 1);
  },

  /**
   * Check wether path is within range or not.
   * @param path path to be checked
   * @param range range
   */
  isWithin(path: BEPath, range: BESpan): boolean {
    return BEPath.isAfter(path, range[0]) && BEPath.isBefore(path, range[1]);
  },

  /**
   * Returns the parent path of childPath.
   * @param childPath path of child whose parent path is requested
   */
  parent(childPath: BEPath) {
    if (childPath.length <= 1) return [];

    return childPath.slice(0, childPath.length - 1);
  },
};
