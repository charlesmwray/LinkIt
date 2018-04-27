// Framework
import React, { Component } from 'react';

// Auth
import Firebase from '../Firebase/Auth.js';

// css
import '../Styles/ManageLinks.css';

import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const LinkList = (props) => {
    const isntActiveYet = (link) => {
        return ( link.startDate !== "" && new Date(link.startDate) >= new Date() )
    }
    const isExpired = (link) => {
        return ( link.endDate !== "" && new Date(link.endDate) <= new Date() )
    }
    const isActive = (link) => {
        return (
            ( link.hasOwnProperty('active') && link.active ) &&
            !isntActiveYet(link) &&
            !isExpired(link)
        );
    }
    if (props.links.length > 0) {
        let l = props.links.map( (link, i) => {
            console.log('isnt', isntActiveYet(link), 'exp', isExpired(link), 'active', isActive(link));
            return (
                <li className={
                    isActive(link)
                    ?
                    'active link'
                    :
                    'link' } key={i}>
                    <div className="cell title-section">
                        <div className="title">{link.linkText}</div>
                        <div className="subtitle">{link.subtitle}</div>
                        <div className="url">{link.link}</div>
                    </div>
                    <div className="cell metadata-section">
                        <div className={ !isntActiveYet(link) ? "metadata active date" : "metadata date" }>
                            <span className="label">Start:</span> {link.startDate}
                        </div>
                        <div className={ !isExpired(link) ? "metadata active date" : "metadata date" }>
                            <span className="label">End:</span> {link.endDate}
                        </div>
                        <div className="metadata">
                            <span className="label">Clicks:</span> {link.clicks ? Object.keys(link.clicks).length : 0}
                        </div>
                    </div>
                    <div className="cell action-section">
                        <Toggle
                            label="Active"
                            defaultToggled={ link.hasOwnProperty('active') ? link.active : true }
                            onToggle={ (e, i) => { props.updateItem( 'active', link.id, i ); } }
                        />
                        <IconButton onClick={ () => { props.updateItem( 'delete', link.id ); } } touch={true}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </li>
            )
        })
        return (
            <div>
                <ul className="link-wrapper">
                    {l}
                </ul>
            </div>
        );
    } else {
        return ''
    }
}

class ManageLinks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            links: false
        }
    }
    componentWillMount() {
        let links = Firebase.database().ref( 'users/' + this.props.userInfo.id + '/links/' );

        links.on('value', (snapshot) => {
            let links = snapshot.val();

            if (links) {
                let keys = Object.keys(links);
                let linklist;
                const now = new Date();

                linklist = keys.map((key) => {
                    let item = links[key];

                    item.id = key;
                    return item;

                });

                this.setState({
                    links: linklist.filter(link => !link.deleted)
                });
            }
        });
    }
    updateItem (type, linkId, e) {
        let link = Firebase.database().ref( 'users/' + this.props.userInfo.id + '/links/' + linkId + '/');

        switch (type) {
            case 'delete':
                link.update({ deleted: true });
                break;
            case 'active':
                link.update({ active: e });
                break;
            default:

        }

        console.log(type, linkId, e);
    }
    render() {
        return (
            <div className="panel">
                <h2>Manage Links</h2>
                {
                    this.state.links &&
                    <LinkList
                        links={this.state.links}
                        updateItem={this.updateItem.bind(this)}
                    />
                }
            </div>
        )
    }
}

export default ManageLinks;
