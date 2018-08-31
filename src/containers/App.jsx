import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {Panel} from './';

export let App = ({rootPanel}) => (
    <div className="app">
        <Panel
            type={rootPanel.type}
            properties={rootPanel.properties}
        />
    </div>
);

App.propTypes = {
    rootPanel: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    rootPanel: state.layout['root-panel']
});

// eslint-disable-next-line no-func-assign
App = connect(mapStateToProps)(App);
