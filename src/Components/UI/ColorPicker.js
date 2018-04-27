import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

import { SwatchesPicker } from 'react-color';

class ColorPicker extends Component {
    constructor() {
        super();

        this.state = {
            showPicker: false,
            color: ''
        }
    }
    componentWillMount() {
        this.setState({
            color: this.props.value
        })
    }
    toggleShowPicker() {
        this.setState({
            showPicker: !this.state.showPicker
        });
    }
    hidePicker() {
        this.setState({
            showPicker: false
        })
    }
    handleColorSelect(color, e) {
        this.setState({
            color: color.hex,
            showPicker: false
        });
        this.props.handler(e);
    }
    render() {
        return (
            <div>
                <TextField
                    floatingLabelText={ this.props.label || '' }
                    onClick={ () => { this.toggleShowPicker(); } }
                    id={ this.props.id }
                    value={ this.state.color }
                />
                {
                    this.state.showPicker &&
                    <div style={ { position: 'absolute' } }>
                        <SwatchesPicker onChange={ (color, e) => { this.handleColorSelect(color, e); } } />
                    </div>
                }
            </div>
        )
    }
}

export default ColorPicker;
