export const types = {
  yes: {
    text: 'ответил "да"',
    priority: 'green',
    icon: 'yes',
  },
  no: {
    text: 'ответил "нет"',
    priority: 'red',
    icon: 'no',
  },
  ask: {
    text: 'поднял руку',
    priority: 'green',
    icon: 'ask',
  },
  left: {
    text: 'отошел без предупреждения',
    priority: 'red',
  },
  away: {
    text: 'отошел с предупреждением',
    priority: 'default',
  },
  back: {
    text: 'вернулся',
    priority: 'default',
  },
  smoke: {
    text: 'курит',
    priority: 'red',
  },
  addcoins: {
    text: 'получил 100 монет',
    priority: 'green',
    hidden: true,
  },
  removecoins: {
    text: 'потерял 100 монет',
    priority: 'red',
    hidden: true,
  },
  badge: {
    text: 'часто отвечает',
    priority: 'green',
    hidden: true,
  },
  star: {
    text: 'молодец',
    priority: 'green',
    hidden: true,
  },
  bad: {
    text: 'совсем не отвечает',
    priority: 'red',
    hidden: true,
  },
};

export function getActionData(name) {
  return types[name] || {
    text: name,
    priority: 'default',
  };
}

export default {
  getActionData,
  types,
};
