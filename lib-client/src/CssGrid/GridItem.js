import React from 'react';
import {Component} from 'react';
import PropTypes from 'prop-types';

class GridItem extends Component {

    render() {

        var _style = {}
        if( this.props.style ) {
            _style = this.props.style;
        }

        if( !_style.gridGap ) {
            _style.gridGap = this.props.gap;
        }
        if( !_style.gridTemplateRows ) {
            _style.gridRow = this.props.rows;
        }
        if( !_style.gridTemplateColumns ) {
            _style.gridColumn = this.props.columns;
        }

        return (
            <div style={_style}>{this.props.children}</div>
        )
    }
}

GridItem.propTypes = {
    gap: PropTypes.number,
    rows: PropTypes.string,
    columns: PropTypes.string
};

export default GridItem;