import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

import {Divider} from '../components';
import Row from './Row';

function App({rows}) {
    return (
        <div className="app">
            {rows.map((row, i) => (
                <React.Fragment key={generate()}>
                    <Row id={i} height={row.height} columns={row.columns} />
                    <Divider direction="horizontal" />
                </React.Fragment>
            ))}
        </div>
    );
}

App.propTypes = {
    rows: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    rows: state.layout.rows
});

// eslint-disable-next-line no-func-assign
App = connect(mapStateToProps)(App);

export default App;
