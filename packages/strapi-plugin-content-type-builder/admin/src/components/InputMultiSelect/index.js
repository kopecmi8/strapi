/**
 *
 * InputSelect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isObject } from 'lodash';
import cn from 'classnames';

import Select from 'react-select';
import styles from './styles.scss';

class InputMultiSelect extends React.Component {

  constructor() {
    super();

    this.handleChange.bind(this);
  }

  handleChange = (value) => {
    const target = {
      type: 'multiSelect',
      name: this.props.name,
      value: value,
    };

    this.props.onChange({target: target});
  }

  render() {
    const options = this.props.selectOptions.map((item) => {
      if(isObject(item)) {
        return item;
      }else {
        return {label: item, value: item};
      }
    });

    const wrapperStyle = {
      marginTop: '.9rem',
    };

    return (
      <Select
        autoFocus={this.props.autoFocus}
        className={cn(
          !this.props.deactivateErrorHighlight && this.props.error && 'is-invalid' && styles.Select,
          !isEmpty(this.props.className) && this.props.className,
        )}
        wrapperStyle={wrapperStyle}
        disabled={this.props.disabled}
        id={this.props.name}
        name={this.props.name}
        onBlur={this.props.onBlur}
        onChange={this.handleChange}
        onFocus={this.props.onFocus}
        options={options}
        placeholder={this.props.placeholder ? this.props.placeholder : undefined}
        style={this.props.style}
        simpleValue
        tabIndex={this.props.tabIndex}
        value={this.props.value}
      />
    );
  }
}

InputMultiSelect.defaultProps = {
  autoFocus: false,
  className: '',
  deactivateErrorHighlight: false,
  disabled: false,
  error: false,
  onBlur: () => {},
  onFocus: () => {},
  style: {},
  tabIndex: '0',
  placeholder: '',
};

InputMultiSelect.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  deactivateErrorHighlight: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  selectOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        params: PropTypes.object,
        value: PropTypes.string.isRequired,
      }),
      PropTypes.string,
    ]),
  ).isRequired,
  style: PropTypes.object,
  tabIndex: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default InputMultiSelect;
