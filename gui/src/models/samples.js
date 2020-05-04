import sample from 'lodash/sample';
import random from 'lodash/random';

import { types as actionTypes } from './action-types';

export const samplePerks = [
  { icon: 'star' },
  { icon: 'banana' },
  { icon: 'sun' },
  { icon: 'badge' },
];

export const avatars = [
  '/img/samples/avatar-borat.jpg',
  '/img/samples/avatar-masha.jpg',
  '/img/samples/avatar-angelina.jpg',
  '/img/samples/avatar-seymour.jpg',
];

export function getRandomAvatar() {
  return sample(avatars);
}

export const sampleUsers = [
  { id: '1', name: 'Борат', avatar: avatars[0] },
  { id: '2', name: 'Маша', avatar: avatars[1] },
  { id: '3', name: 'Ангелина', avatar: avatars[2] },
  { id: '4', name: 'Seymour', avatar: avatars[3] },
]
  .map((user) => {
    user.perks = Array(random(1, 7)).fill(true).map(() => ({
      id: random(100000), ...sample(samplePerks),
    }));
    return user;
  });

export function* actionMaker() {
  const actionKeys = Object.keys(actionTypes);
  let id = 1;
  while (true) {
    yield {
      user: sample(sampleUsers),
      name: sample(actionKeys),
      id,
      time: new Date().getTime(),
    };
    id += 1;
  }
}

export const actionGenerator = actionMaker();

export default {
  samplePerks,
  sampleUsers,
  actionMaker,
  actionGenerator,
  getRandomAvatar,
};
