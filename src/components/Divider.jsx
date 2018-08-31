import PropTypes from 'prop-types';
import React from 'react';

export const Divider = ({direction}) => (
    <div className={`divider ${direction}`} />
);

Divider.propTypes = {
    direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
};
