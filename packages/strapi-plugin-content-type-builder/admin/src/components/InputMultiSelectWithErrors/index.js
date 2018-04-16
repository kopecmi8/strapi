/**
 *
 * InputMultiSelectWithErrors;
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isFunction } from 'lodash';
import cn from 'classnames';

// Design
import Label from 'components/Label';
import InputDescription from 'components/InputDescription';
import InputErrors from 'components/InputErrors';
import InputMultiSelect from 'components/InputMultiSelect';

import styles  from './styles.scss';

class InputMultiSelectWithErrors extends React.Component {
  state = { errors: [] };

  componentDidMount() {
    const { errors } = this.props;
    // Display input error if it already has some
    if (!isEmpty(errors)) {
      this.setState({ errors });
    }

  }

  componentWillReceiveProps(nextProps) {
    // Check if errors have been updated during validations
    if (nextProps.didCheckErrors !== this.props.didCheckErrors) {
      // Remove from the state the errors that have already been set
      const errors = isEmpty(nextProps.errors) ? [] : nextProps.errors;
      this.setState({ errors });
    }
  }

  handleBlur = () => {
    if (!isEmpty(this.props.value)) {
      this.setState({ errors: [] });
    }
  }

  render() {
    const {
      autoFocus,
      className,
      customBootstrapClass,
      deactivateErrorHighlight,
      disabled,
      errorsClassName,
      errorsStyle,
      inputClassName,
      inputDescription,
      inputDescriptionClassName,
      inputDescriptionStyle,
      inputStyle,
      label,
      labelClassName,
      labelStyle,
      multi,
      name,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      selectOptions,
      style,
      tabIndex,
      value,
    } = this.props;

    return (
      <div
        className={cn(
          styles.containerSelect,
          customBootstrapClass,
          !isEmpty(className) && className,
        )}
        style={style}
      >
        <Label
          className={labelClassName}
          htmlFor={name}
          message={label}
          style={labelStyle}
        />
        <InputMultiSelect
          autoFocus={autoFocus}
          className={inputClassName}
          deactivateErrorHighlight={deactivateErrorHighlight}
          disabled={disabled}
          error={!isEmpty(this.state.errors)}
          multi={multi}
          name={name}
          onBlur={isFunction(onBlur) ? onBlur : this.handleBlur}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          selectOptions={selectOptions}
          style={inputStyle}
          tabIndex={tabIndex}
          value={value}
        />
        <InputDescription
          className={inputDescriptionClassName}
          message={inputDescription}
          style={inputDescriptionStyle}
        />
        <InputErrors
          className={errorsClassName}
          errors={this.state.errors}
          style={errorsStyle}
        />
      </div>
    );
  }
}

InputMultiSelectWithErrors.defaultProps = {
  autoFocus: false,
  className: '',
  customBootstrapClass: 'col-md-6',
  deactivateErrorHighlight: false,
  didCheckErrors: false,
  disabled: false,
  errors: [],
  errorsClassName: '',
  errorsStyle: {},
  inputClassName: '',
  inputDescription: '',
  inputDescriptionClassName: '',
  inputDescriptionStyle: {},
  inputStyle: {},
  label: '',
  labelClassName: '',
  labelStyle: {},
  multi: false,
  onBlur: false,
  onFocus: () => {},
  placeholder: '',
  selectOptions: [],
  style: {},
  tabIndex: '0',
};

InputMultiSelectWithErrors.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  customBootstrapClass: PropTypes.string,
  deactivateErrorHighlight: PropTypes.bool,
  didCheckErrors: PropTypes.bool,
  disabled: PropTypes.bool,
  errors: PropTypes.array,
  errorsClassName: PropTypes.string,
  errorsStyle: PropTypes.object,
  inputClassName: PropTypes.string,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  inputDescriptionClassName: PropTypes.string,
  inputDescriptionStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  labelClassName: PropTypes.string,
  labelStyle: PropTypes.object,
  multi: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
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

export default InputMultiSelectWithErrors;
