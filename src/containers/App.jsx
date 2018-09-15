import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {Panel} from './';

export let App = ({rootPanel}) => (
    <div className="app">
        <Panel
            type={rootPanel.type}
            panelStyle={rootPanel.style}
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

App = connect(mapStateToProps)(App);
