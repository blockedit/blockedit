import {
  createEditorKit,
  BEBaseElement,
  BEBaseNode,
  BEBaseLocation,
} from '../../src';

interface FooElement<T extends BEBaseNode> extends BEBaseElement<T> {
  type: 'foo';
}

interface BarElement<T extends BEBaseNode> extends BEBaseElement<T> {
  type: 'bar';
}

interface LeafElement extends BEBaseNode {
  type: 'leaf';
  text?: string;
}

export type CustomNode =
  | FooElement<CustomNode>
  | BarElement<CustomNode>
  | LeafElement;

export type CustomLocation = BEBaseLocation;

export const editorKit = createEditorKit<CustomNode, BEBaseLocation>();
