import React from 'react';

import './index.scss';

export default function ({ src, size = 'xl' }) {
  return <img className={`funny-icon funny-icon-${size}`} src={`/icons/${src}.svg`} alt="Иконка" />;
}
