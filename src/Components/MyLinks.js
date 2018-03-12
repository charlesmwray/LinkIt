import React, { Component } from 'react';

import Firebase from '../Firebase/Auth.js';

const trackAndNav = (link, linkId, userId) => {
    const clicks = Firebase.database().ref('users/' + userId + '/links/' + linkId + '/clicks');

    clicks.push(
        {
            click: new Date().toString()
        }
    );
    // document.location.href = link;
}

const Links = (props) => {
    return (
        (props.links && props.links.length > 0) && props.links.map((link, i) => {
            return (
                <div className="my-link" key={i} onClick={ () => { trackAndNav(link.link, link.id, props.userId) } }>
                    <div className="link">
                        {link.linkText}
                    </div>
                    <div className="subtitle">
                        {link.subtitle}
                    </div>
                </div>
            )
        })
    )
}

class MyLinks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            links: null,
            userId: props.userId
        };
    }
    componentWillMount() {
        this.getLinks();
        this.getPreferences();
    }
    getPreferences() {
        const preferences = Firebase.database().ref( 'users/' + this.state.userId + '/preferences/' );

        preferences.on('value', (snapshot) => {
            let preferences = snapshot.val();

            if (preferences) {
                this.setState({
                    linksHeaderImage: preferences.profileImageLink,
                    instagramId: preferences.instagramId,
                    instagramIdColor: preferences.instagramIdColor,
                });

                document.body.style.backgroundColor = preferences.bgColor;
            }
        });
    }
    getLinks() {
        const links = Firebase.database().ref( 'users/' + this.state.userId + '/links/' );
        let linklist;

        links.on('value', (snapshot) => {
            let links = snapshot.val();

            if (links) {
                let keys = Object.keys(links);
                const now = new Date();

                linklist = keys.map((key) => {
                    let item = links[key]
                    item.id = key;
                    return item;
                });

                this.setState({
                    links: linklist.filter( (link) => {
                        return (
                            ( link.startDate === "" || new Date(link.startDate) <= now ) &&
                            ( link.endDate === "" || new Date(link.endDate) >= now )
                        )
                    })
                });
            }
        });
    }
    render() {
        if ( this.state.linksHeaderImage ) {
            return (
                <div className="my-links" style={ { backgroundColor: this.state.bgColor } }>
                    <img className="logo" src={this.state.linksHeaderImage} alt="What Great Grandma Ate logo." />
                    <h2 className="my-links-header" style={ { color: this.state.instagramIdColor } }>{this.state.instagramId}</h2>
                    <Links links={this.state.links} userId={this.state.userId} />
                </div>
            )
        } else {
            return (
                <span></span>
            )
        }
    }
}

export default MyLinks;
