import { isPlainObject } from 'is-plain-object';
import { BEBaseNode } from './Node';

export interface BEBaseElement<TChildren extends BEBaseNode>
  extends BEBaseNode {
  children: TChildren[];
}

export const BEElement = {
  isElement<TChildren extends BEBaseNode>(
    node: any
  ): node is BEBaseElement<TChildren> {
    return isPlainObject(node) && Array.isArray(node.children);
  },
};
