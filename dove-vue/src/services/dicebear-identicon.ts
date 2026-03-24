import { createAvatar, type Result } from '@dicebear/core';
import * as identicon from '@dicebear/identicon';

export function makeIdenticon(uuid: string): Result {
  const icon = createAvatar(identicon, {
    seed: uuid,
    // ... other options
  });
  return icon;
  //return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toDataUri.toString())}`;
}