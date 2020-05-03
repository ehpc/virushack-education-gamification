import React from 'react';

import './index.scss';

export default function ({
  src, size = 'xl', alt = 'Иконка', className = '',
}) {
  return <img className={`funny-icon funny-icon-${size} ${className}`} src={`/icons/${src}.svg`} alt={alt} />;
}
