import React, { Component } from 'react';

// Auth
import Firebase from '../Firebase/Auth.js';

// Components
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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
    componentDidMount() {
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
            default:
                this.setState({
                    bgColor: document.getElementById('bgColor').value,
                    profileImageLink: document.getElementById('profileImageLink').value,
                    instagramId: document.getElementById('instagramId').value,
                    instagramIdColor: document.getElementById('instagramIdColor').value
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
            id: this.state.props.userInfo.id
        });

        if ( this.state.props.newUser ) {
            const userMap = Firebase.database().ref( 'userMap' ).push({
                id: this.state.props.userInfo.id,
                instagramId: this.state.instagramId
            })

            this.state.props.continueLogin(this.state.props.userInfo, 'togglePrefs');
            this.state.props.togglePreferences();
        }
    }
    render() {
        return (
            <div className="preferences">
                <h2>Preferences</h2>
                <form
                    onChange={ e => { this.updatePreview(e); } }
                    onSubmit={ e => { this.savePrefs(e);     } }
                >
                    <div className="form-element">
                        <label>Instagram ID</label>
                        <TextField required id="instagramId" />
                    </div>
                    <div className="form-element">
                        <label>Instagram ID Color</label>
                        <TextField id="instagramIdColor" />
                    </div>
                    <div className="form-element">
                        <label>Profile Image Link</label>
                        <TextField id="profileImageLink" />
                    </div>
                    <div className="form-element">
                        <label>Background Color</label>
                        <TextField id="bgColor" defaultValue="pink" />
                    </div>
                    <div className="action-button">
                        <RaisedButton type="submit" label="Save Preferences" />
                    </div>
                </form>
                <br /><br />
                <h3>Preview</h3>
                <div className="prefs-preview" style={ { backgroundColor: this.state.bgColor } }>
                    <img className="avatar" src={this.state.profileImageLink} />
                    <h2 style={ { color: this.state.instagramIdColor } }>{this.state.instagramId}</h2>
                </div>
            </div>
        )
    }
}
