import PropTypes from 'prop-types';
import React from 'react';

export function Divider({direction}) {
    return (
        <div className={`divider ${direction}`}></div>
    );
}

Divider.propTypes = {
    direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
};
