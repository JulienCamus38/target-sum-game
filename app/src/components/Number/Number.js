import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Number.css';

class Number extends PureComponent {

  handleClick = () => {
    if (this.props.clickable) {
      this.props.onClick(this.props.id);
    }
  };

  componentWillUpdate() {
    console.log('Number Updated');
  }

  render() {
    return (
      <div
        className="number"
        style={{ opacity: this.props.clickable ? 1 : 0.3 }}
        onClick={this.handleClick}
      >
        {this.props.value}
      </div>
    );
  }
}

Number.propsTypes = {
  key: PropTypes.number,
  value: PropTypes.number,
  id: PropTypes.number,
  clickable: PropTypes.bool,
  onClick: PropTypes.func
};

export default Number;