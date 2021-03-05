import { isPlainObject } from 'is-plain-object';
import { BEPath } from './Path';

export interface BEBaseLocation {
  path: BEPath;
  [key: string]: unknown;
}

/**
 * A Location refers to a specific position within a leaf node in a document.
 */

export const BELocation = {
  isLocation(location: any): location is BEBaseLocation {
    return isPlainObject(location) && BEPath.isPath(location.path);
  },
};

/**
 * A range specifies a range between 2 locations in a document.
 */
export interface Range<
  TAnchor extends BEBaseLocation = BEBaseLocation,
  TFocus extends BEBaseLocation = BEBaseLocation
> {
  anchor: TAnchor;
  focus: TFocus;
}

export const Range = {
  isRange(range: any): range is Range {
    return (
      isPlainObject(range) &&
      BELocation.isLocation(range.anchor) &&
      BELocation.isLocation(range.focus)
    );
  },

  isForward(range: Range): boolean {
    return BEPath.isBefore(range.anchor.path, range.focus.path);
  },

  isBackward(range: Range): boolean {
    return !Range.isForward(range);
  },
};
