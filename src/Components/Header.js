import React from 'react';

// Styles
import '../Styles/Header.css';

// UI
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';

const buttonStyles = {
    marginLeft: '.5rem'
}

const Header = (props) => {
    return (
        <div className="header">
            {
                props.userInfo &&
                <Avatar style={ { marginRight: '.5rem' } } src={props.userInfo.picture} />
            }

            <h1 className="title">Linkit</h1>
            {
                props.userInfo === null &&
                <RaisedButton className="login-button" label="Log in" onClick={ () => { props.login(); } } />
            }
            {
                props.userInfo &&
                <div className="buttons">
                    {
                        !props.showAddLink &&
                        <FlatButton
                            primary={true}
                            className="add-link"
                            onClick={ () => { props.toggleAddLink(); } }
                            label="Add Link"
                            style={ buttonStyles }
                        />

                    }
                    <FlatButton
                        onClick={ () => { props.toggleMyLinks(); } }
                        label="My Links"
                        style={ buttonStyles }
                    />
                    <FlatButton
                        className="manage-links"
                        onClick={ () => { props.toggleManageLinks(); } }
                        label="Manage Links"
                        style={ buttonStyles }
                    />
                    <IconMenu
                      iconButtonElement={
                          <IconButton><MoreVertIcon /></IconButton>
                      }
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      className="menu"
                    >
                      <MenuItem primaryText="Preferences" onClick={ () => { props.togglePreferences() } } />
                      <MenuItem primaryText="Log Out" onClick={ () => { props.logout(); } } />
                    </IconMenu>
                </div>
            }
        </div>
    )
}

export default Header;
