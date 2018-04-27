// Framework
import React, { Component } from 'react';

// Auth
import Firebase from '../Firebase/Auth.js';

// Styles
import '../Styles/AddLink.css';
import '../Styles/MyLinks.css';


// UI
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

const Preview = (props) => {
    return (
        <div className="preview">
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
            subtitle: subtitle,
            active: true,
            deleted: false
        }

        const itemsRef = Firebase.database().ref( 'users/' + this.state.userInfo.id + '/links/' );

        itemsRef.push(newItem);

        this.props.toggleAddLink();
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
            <div className="add-new-item panel">
                <form className="form" onSubmit={ (e) => { this.addLink(e) } } onChange={ (e) => { this.updatePreview(e) } }>
                    <h2>Add new link.</h2>
                    <DatePicker
                        id="startDate"
                        hintText="optional"
                        autoOk={ true }
                        floatingLabelText="Start Date"
                    />
                    <DatePicker
                        id="endDate"
                        hintText="optional"
                        autoOk={ true }
                        floatingLabelText="End Date"
                    />
                    <TextField
                        floatingLabelText="URL"
                        required
                        id="link"
                    />
                    <TextField
                        floatingLabelText="Link"
                        required
                        id="linkText"
                    />

                    <TextField
                        floatingLabelText="Subtitle"
                        id="subtitle"
                        hintText="optional"
                    />
                    <div className="action-section">
                        <RaisedButton style={ { marginRight: '1rem' } } type="button" onClick={ () => { this.props.toggleAddLink(); } } label="Cancel" />
                        <RaisedButton type="submit" primary={true} label="Add Link" />
                    </div>
                </form>
                <Preview preview={this.state.preview} />
            </div>
        )
    }
}
