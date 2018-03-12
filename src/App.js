// Framework
import React, { Component } from 'react';

// Auth
import Firebase from './Firebase/Auth.js';

// Components
import Header from './Components/Header';
import Preferences from './Components/Preferences';

// UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Theme from './Styles/Theme/Theme';

class App extends Component {
    constructor() {
        super();

        this.state = {
            userInfo: null,
            newUser: false
        }
    }
    componentWillMount() {
        const userInfo = localStorage.getItem('linkit');
        userInfo && this.setState({
            userInfo: JSON.parse(userInfo)
        })
    }
    togglePreferences() {
        this.setState({
            showPreferences: !this.state.showPreferences
        })
    }
    setUserInfo(userInfo) {
        localStorage.setItem( 'linkit', JSON.stringify(userInfo) );
        this.setState({
            userInfo: userInfo,
            newUser: false
        });
    }
    login() {
        const provider = new Firebase.auth.GoogleAuthProvider();

        Firebase.auth().signInWithPopup(provider).then((result) => {
            const userInfo = result.additionalUserInfo.profile;
            const prefs = Firebase.database().ref( 'users/' + userInfo.id + '/preferences' );

            prefs.once('value', (snapshot) => {
                let existingUser = (snapshot.val() !== null);

                if (!existingUser) {
                    this.setState({
                        showPreferences: true,
                        newUser: true,
                        userInfo: userInfo
                    });
                } else {
                    this.setUserInfo(userInfo);
                }
            });
        }).catch((error) => {
            alert(error.message);
        });
    }
    logout() {
        Firebase.auth().signOut().then(() => {

            localStorage.removeItem('linkit');

            this.setState({
                userInfo: null
            });
        });
    }
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(Theme)}>
                <div className="App">
                    {
                        !this.state.showPreferences &&
                        <Header
                            login={ this.login.bind(this) }
                            logout={ this.logout.bind(this) }
                            userInfo={ this.state.userInfo }
                            togglePreferences={ this.togglePreferences.bind(this) }
                        />
                    }
                    {
                        this.state.showPreferences &&
                        <Preferences
                            userInfo={ this.state.userInfo }
                            newUser={ this.state.newUser }
                            continueLogin={ this.setUserInfo.bind(this) }
                            togglePreferences={ this.togglePreferences.bind(this) }
                        />
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
