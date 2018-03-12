// Framework
import React, { Component } from 'react';

// Auth
import Firebase from '../Firebase/Auth.js';

// Components
import MyLinks from './MyLinks';

// UI
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

const Preview = (props) => {
    return (
        <div>
            <h3>Link preview</h3>
            <div className="my-link">
                <div className="link">
                    {props.preview.linkText}
                </div>
                <div className="subtitle">
                    {props.preview.subtitle}
                </div>
            </div>
        </div>
    )
}

export default class AddEditLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            userInfo: props.userInfo,
            preview: {
                linkText: 'Title preview',
                subtitle: 'subtitle preview'
            }
        };
    }
    showAddItemForm() {
        this.setState({
            showModal: !this.state.showModal
        });
    }
    addLink(e) {
        e.preventDefault();

        let startDate = document.getElementById('startDate').value,
            endDate = document.getElementById('endDate').value,
            link = document.getElementById('link').value,
            linkText = document.getElementById('linkText').value,
            subtitle = document.getElementById('subtitle').value;

        const newItem = {
            startDate: startDate,
            endDate: endDate,
            link: link,
            linkText: linkText,
            subtitle: subtitle
        }

        const itemsRef = Firebase.database().ref( 'users/' + this.state.userInfo.id + '/links/' );

        itemsRef.push(newItem);
    }
    updatePreview() {
        this.setState({
            preview: {
                linkText: document.getElementById('linkText').value,
                subtitle: document.getElementById('subtitle').value
            }
        });
    }
    render() {
        return (
            <div>
                <RaisedButton onClick={ () => this.showAddItemForm() } label="Add Link" />
                <RaisedButton className="logout-button" label="Log out" onClick={ () => { this.props.logout() } } />
                <div onClick={ () => { this.props.togglePreferences() } } className="avatar" style={ { backgroundImage: 'url(' + this.state.userInfo.picture + ')' } }></div>
                {
                    this.state.showModal &&
                    <div className="add-new-item">
                        <form onSubmit={ (e) => { this.addLink(e) } } onChange={ (e) => { this.updatePreview(e) } }>
                            <div className="form-element">
                                <label>Start Date</label>
                                <DatePicker id="startDate" hintText="optional" />
                            </div>

                            <div className="form-element">
                                <label>End Date</label>
                                <DatePicker id="endDate" hintText="optional" />
                            </div>

                            <div className="form-element">
                                <label>Link</label>
                                <TextField required id="link" />
                            </div>

                            <div className="form-element">
                                <label>Link text</label>
                                <TextField required id="linkText" />
                            </div>

                            <div className="form-element">
                                <label>Subtitle</label>
                                <TextField id="subtitle" hintText="optional" />
                            </div>

                            <div className="action-button">
                                <RaisedButton type="submit" label="Add Link" />
                            </div>
                        </form>
                        <Preview preview={this.state.preview} />
                    </div>
                }
                <h3>Current Links</h3>
                <MyLinks userId={this.state.userInfo && this.state.userInfo.id} />
            </div>
        )
    }
}
