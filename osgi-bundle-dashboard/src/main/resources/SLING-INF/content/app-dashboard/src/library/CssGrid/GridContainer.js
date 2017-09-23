import React, {Component} from "react";
import PropTypes from 'prop-types';

class GridContainer extends Component {

    render() {
        var _style = {};
        if( this.props.style ) {
            _style = this.props.style;
        }

        _style.display = "grid";
        if( !_style.width ) {
            //_style.width = "100%";
        }
        if( !_style.height ) {
            //_style.height = "100%";
        }
        if( !_style.gridGap ) {
            _style.gridGap = this.props.gap;
        }
        if( !_style.gridTemplateRows ) {
            _style.gridTemplateRows = this.props.rowTemplate;
        }
        if( !_style.gridTemplateColumns ) {
            _style.gridTemplateColumns = this.props.columnTemplate;
        }

        return (
            <div style={_style}>{this.props.children}</div>
        );
    }
}

GridContainer.propTypes = {
    gap: PropTypes.number,
    rowTemplate: PropTypes.string,
    columnTemplate: PropTypes.string
};

export default GridContainer;