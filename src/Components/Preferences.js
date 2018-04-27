import React, { Component } from 'react';

// Auth
import Firebase from '../Firebase/Auth.js';

// Styles
import '../Styles/Header.css';
import '../Styles/MyLinks.css';

// Components
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import ColorPicker from './UI/ColorPicker';

const buttonStyles = {
    margin: '0 1rem'
}

export default class Preferences extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bgColor: 'pink',
            profileImageLink: 'https://image.flaticon.com/icons/png/512/78/78373.png',
            instagramId: '@your_instagram_id',
            instagramIdColor: '#222',
            props: props
        }
    }
    componentWillMount() {
        const preferences = Firebase.database().ref( 'users/' + this.state.props.userInfo.id + '/preferences/' );

        preferences.on('value', (snapshot) => {
            let preferences = snapshot.val();

            if (preferences) {
                let keys = Object.keys(preferences);

                keys.forEach( (key) => {
                    let item = document.getElementById(key);

                    if ( item ) {
                        item.value = preferences[key];
                        item.dispatchEvent(new Event('change'));
                    }
                });

                this.updatePreview();
            }
        });
    }
    updatePreview(e) {
        let target;
        if (e) {
            target = e.target.id;
        }
        switch (target) {
            case 'bgColor':
                this.setState({
                    bgColor: e.target.value
                });
                break;
            case 'profileImageLink':
                this.setState({
                    profileImageLink: e.target.value
                });
                break;
            case 'instagramId':
                this.setState({
                    instagramId: e.target.value
                });
                break;
            case 'instagramIdColor':
                this.setState({
                    instagramIdColor: e.target.value
                });
                break;
            case 'defaultLinkColor':
                this.setState({
                    defaultLinkColor: e.target.value
                });
                break;
            default:
                this.setState({
                    bgColor: document.getElementById('bgColor').value,
                    profileImageLink: document.getElementById('profileImageLink').value,
                    instagramId: document.getElementById('instagramId').value,
                    instagramIdColor: document.getElementById('instagramIdColor').value,
                    defaultLinkColor: document.getElementById('defaultLinkColor').value
                })
                break;
        }
    }
    savePrefs(e) {
        // Save userPrefs
        const itemsRef = Firebase.database().ref( 'users/' + this.state.props.userInfo.id + '/preferences/' );

        itemsRef.set({
            bgColor: this.state.bgColor,
            profileImageLink: this.state.profileImageLink,
            instagramId: this.state.instagramId,
            instagramIdColor: this.state.instagramIdColor,
            id: this.state.props.userInfo.id,
            defaultLinkColor: this.state.defaultLinkColor
        });

        if ( this.state.props.newUser ) {
            Firebase.database().ref( 'userMap' ).push({
                id: this.state.props.userInfo.id,
                instagramId: this.state.instagramId
            });

            this.state.props.continueLogin(this.state.props.userInfo, 'togglePrefs');
            this.state.props.togglePreferences();
        }
        // <TextField floatingLabelText="Link color" id="defaultLinkColor" defaultValue='#000' />
        // <TextField floatingLabelText="Background color" id="bgColor" defaultValue="lightblue" />

    }
    render() {
        return (
            <div className="preferences panel">
                <h2>Preferences</h2>
                <form
                    onChange={ e => { this.updatePreview(e); } }
                    onSubmit={ e => { this.savePrefs(e);     } }
                >
                    <TextField floatingLabelText="Instagram username" required id="instagramId" />
                    <TextField floatingLabelText="Instagram username color" id="instagramIdColor" />
                    <TextField floatingLabelText="Profile image link" id="profileImageLink" />
                    <ColorPicker
                        id="bgColor"
                        handler={ (e) => { this.updatePreview(e) } }
                        label="Background color"

                    />
                    <ColorPicker
                        id="defaultLinkColor"
                        handler={ (e) => { this.updatePreview(e) } }
                        label="Link color"

                    />
                    <div className="action-section">
                        <RaisedButton style={buttonStyles} onClick={ () => { this.state.props.togglePreferences() } } label="Cancel" />
                        <RaisedButton style={buttonStyles} type="submit" label="Save Preferences" />
                    </div>

                </form>
                <br /><br />
                <h3>Preview</h3>
                <div id="my-links" className="prefs-preview" style={ { backgroundColor: this.state.bgColor } }>
                    <img alt="avatar" className="logo" src={this.state.profileImageLink} />
                    <h2 className="my-links-header" style={ { color: this.state.instagramIdColor } }>{this.state.instagramId}</h2>
                    <div style={ { color: this.state.defaultLinkColor, borderColor: this.state.defaultLinkColor } } className="my-link">
                        <div className="link">
                            Link
                        </div>
                        <div className="subtitle">
                            Subtitle
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
