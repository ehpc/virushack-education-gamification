import React, { memo } from 'react';

import './index.scss';

export default memo(({
  src, size = 'xl', alt = 'Иконка', className = '', fit = false,
}) => (
  <img
    className={`funny-icon ${fit ? 'funny-icon-fit' : `funny-icon-${size}`} ${className}`}
    src={`/icons/${src}.svg`}
    alt={alt}
  />
));
