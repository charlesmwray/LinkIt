// Framework
import React, { Component } from 'react';

// Auth
import Firebase from './Firebase/Auth.js';

// Components
import Header from './Components/Header';
import Preferences from './Components/Preferences';
import MyLinks from './Components/MyLinks';
import AddLink from './Components/AddLink';
import ManageLinks from './Components/ManageLinks';

// UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Theme from './Styles/Theme/Theme';

class App extends Component {
    constructor() {
        super();

        this.state = {
            userInfo: null,
            newUser: false,
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
            activeSection: this.state.activeSection !== 'Preferences' ? 'Preferences' : ''
        });
    }
    toggleAddLink() {
        this.setState({
            activeSection: this.state.activeSection !== 'AddLink' ? 'AddLink' : ''
        });
    }
    toggleManageLinks() {
        this.setState({
            activeSection: this.state.activeSection !== 'ManageLinks' ? 'ManageLinks' : ''
        });
    }
    toggleMyLinks() {
        this.setState({
            activeSection: this.state.activeSection !== 'MyLinks' ? 'MyLinks' : ''
        });
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
                    <Header
                        login={ this.login.bind(this) }
                        logout={ this.logout.bind(this) }
                        userInfo={ this.state.userInfo }
                        toggleAddLink={ this.toggleAddLink.bind(this) }
                        togglePreferences={ this.togglePreferences.bind(this) }
                        toggleManageLinks={ this.toggleManageLinks.bind(this) }
                        toggleMyLinks={ this.toggleMyLinks.bind(this) }
                        showAddLink={this.state.showAddLink}
                    />
                        {
                            this.state.activeSection === 'Preferences' &&
                            <Preferences
                                userInfo={ this.state.userInfo }
                                newUser={ this.state.newUser }
                                continueLogin={ this.setUserInfo.bind(this) }
                                togglePreferences={ this.togglePreferences.bind(this) }
                            />

                        }
                        {
                            this.state.activeSection === 'AddLink' &&
                            <AddLink
                                userInfo={ this.state.userInfo }
                                toggleAddLink={ this.toggleAddLink.bind(this) }
                            />
                        }
                        {
                            this.state.activeSection === 'ManageLinks' &&
                            <ManageLinks userInfo={ this.state.userInfo } />
                        }
                        {
                            this.state.activeSection === 'MyLinks' &&
                            <div>
                                <h2 style={ { marginLeft: '3rem' } }>Current Links</h2>
                                <MyLinks userId={this.state.userInfo && this.state.userInfo.id} />
                            </div>
                        }
                        {
                            !this.state.activeSection &&
                            <h3 style={{marginLeft:'2rem'}}>This is when nothing is selected. Need to decide what to put here.</h3>
                        }
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
