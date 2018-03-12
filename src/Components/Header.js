import React from 'react';

// Components
import AddLink from '../Components/AddLink';

// UI
import RaisedButton from 'material-ui/RaisedButton';

const Header = (props) => {
    return (
        <div className="header">
            {
                props.userInfo === null &&
                <RaisedButton className="login-button" label="Log in" onClick={ () => { props.login() } } />
            }
            {
                props.userInfo &&
                <div>
                    <AddLink userInfo={props.userInfo} logout={props.logout} togglePreferences={props.togglePreferences} />
                </div>
            }
        </div>
    )
}

export default Header;
