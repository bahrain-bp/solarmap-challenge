import * as React from 'react';
import ErrorPage from './ErrorPage';
import withRoot from '../../withRoot';

function ErrorView() {
    return (
        <React.Fragment>
            <ErrorPage />
        </React.Fragment>
    );
}

export default withRoot(ErrorView);