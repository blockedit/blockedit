import { isPlainObject } from 'is-plain-object';
import { BEPath } from './Path';

export interface BEBaseNode {
  [key: string]: unknown;
}

export type BENodeMatch<T extends BEBaseNode> = [T, BEPath];

export const BENode = {
  isNode(node: any): node is BEBaseNode {
    return isPlainObject(node);
  },
};
