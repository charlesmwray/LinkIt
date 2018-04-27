import React, { Component } from 'react';

import Firebase from '../Firebase/Auth.js';

import MyLinks from './MyLinks';

class LinkRouter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: props.user,
            userId: false
        };
    }
    componentDidMount() {
        this.getId();
    }
    getId() {
        const setState = (id) => {
            this.setState({
                userId: id
            });
        }
        const user = this.state.user;

        Firebase.database().ref('userMap').once('value', (snapshot) => {
            let map = snapshot.val();
            let keys = Object.keys(map);

            let parsedMap = keys.map((key) => {
                let item = map[key]
                return item;
            });

            let userMap = parsedMap.find( item => item.instagramId === user );
            let userId = userMap.id;

            setState(userId);
        });
    }
    render() {
        return (
            <div className="hu">
                {
                    this.state.userId &&
                    <MyLinks userId={this.state.userId} />
                }
            </div>
        )
    }
}

export default LinkRouter;
