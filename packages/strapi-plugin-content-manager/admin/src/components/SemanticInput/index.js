/**
 *
 * Input
 *
 */

import Input from 'components/Input';
import InputImage from 'components/InputImage';
import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty, map, mapKeys, isObject, reject, includes, upperFirst } from 'lodash';
import { FormattedMessage } from 'react-intl';
import styles from './styles.scss';

class SemanticInput extends Input { // eslint-disable-line react/prefer-stateless-function


  renderInputImage = (requiredClass, inputDescription, handleBlur) => {
    let spacer = !isEmpty(this.props.inputDescription) ? <div className={styles.spacer} /> : <div />;

    if (!this.props.noErrorsDescription && !isEmpty(this.state.errors)) {
      spacer = <div />;
    }

    return (
      <div className={`${styles.inputTextArea} ${this.props.customBootstrapClass || 'col-md-6'} ${requiredClass}`}>
        <label htmlFor={this.props.label}>
          <FormattedMessage id={`${this.props.label}`} defaultMessage={upperFirst(this.props.label)} />
        </label>
        <FormattedMessage id={this.props.placeholder || this.props.label}>
          {(placeholder) => (
            <InputImage
              value={this.props.value}
              tabIndex={this.props.tabIndex}
              onChange={(data) => this.props.onChange({ target: {
                  name: this.props.name,
                  value: data,
                }})}
            />
          )}
        </FormattedMessage>
        <div className={styles.inputTextAreaDescriptionContainer}>
          <small>{inputDescription}</small>
        </div>
        {this.renderErrors(styles.errorContainerTextArea)}
        {spacer}
      </div>
    );
  }

  renderInputJson = (requiredClass,  inputDescription) => {
    let spacer = !isEmpty(this.props.inputDescription) ? <div className={styles.spacer} /> : <div />;

    if (!this.props.noErrorsDescription && !isEmpty(this.state.errors)) {
      spacer = <div />;
    }

    return (
      <div className={`${styles.inputTextArea} ${this.props.customBootstrapClass || 'col-md-6'} ${requiredClass}`}>
        <label htmlFor={this.props.label}>
          <FormattedMessage id={`${this.props.label}`} defaultMessage={upperFirst(this.props.label)} />
        </label>
        <FormattedMessage id={this.props.placeholder || this.props.label}>
          {(placeholder) => (
            <textarea
              className={`form-control ${!this.props.deactivateErrorHighlight && !isEmpty(this.state.errors) ? 'is-invalid': ''}`}
              onChange={this.props.onChange}
              value={this.props.value}
              name={this.props.name}
              id={this.props.label}
              onFocus={this.props.onFocus}
              placeholder={placeholder}
              disabled={this.props.disabled}
              autoFocus={this.props.autoFocus}
              tabIndex={this.props.tabIndex}
            />
          )}
        </FormattedMessage>
        <div className={styles.inputTextAreaDescriptionContainer}>
          <small>{inputDescription}</small>
        </div>
        {this.renderErrors(styles.errorContainerTextArea)}
        {spacer}
      </div>
    )
  }

  render() {

    const inputValue = this.props.value || '';
    // override default onBlur
    const handleBlur = this.props.onBlur || this.handleBlur;
    const placeholder = this.props.placeholder || this.props.label;
    const label = this.props.label ?
      <label htmlFor={this.props.label}><FormattedMessage id={`${this.props.label}`} defaultMessage={upperFirst(this.props.label)} /></label>
      : <label htmlFor={this.props.label} />;

    const requiredClass = get(this.props.validations, 'required') && this.props.addRequiredInputDesign ?
      styles.requiredClass : '';

    const input = placeholder ? this.renderFormattedInput(handleBlur, inputValue, placeholder)
      : <input
        name={this.props.name}
        id={this.props.label}
        onBlur={handleBlur}
        onFocus={this.props.onFocus}
        onChange={this.props.onChange}
        value={inputValue}
        type={this.props.type}
        className={`form-control ${!this.props.deactivateErrorHighlight && !isEmpty(this.state.errors) ? 'is-invalid': ''}`}
        placeholder={placeholder}
        disabled={this.props.disabled}
        autoFocus={this.props.autoFocus}
        tabIndex={this.props.tabIndex}
      />;

    const link = !isEmpty(this.props.linkContent) ? <a href={this.props.linkContent.link} target="_blank"><FormattedMessage id={this.props.linkContent.description} /></a> : '';

    let inputDescription = !isEmpty(this.props.inputDescription) ? <FormattedMessage id={this.props.inputDescription} /> : '';

    if (!isEmpty(this.props.linkContent) && !isEmpty(this.props.inputDescription)) {
      inputDescription = <FormattedMessage id='input.description' defaultMessage={`{description}, {link}`} values={{link, description: <FormattedMessage id={this.props.inputDescription} /> }} />;
    }

    let spacer = !isEmpty(this.props.inputDescription) ? <div className={styles.spacer} /> : <div />;

    if (!this.props.noErrorsDescription && !isEmpty(this.state.errors)) {
      spacer = <div />;
    }

    if (this.props.search) {
      return this.renderInputSearch(requiredClass, inputDescription, handleBlur);
    }

    console.log(this.props.type);

    switch (this.props.type) {
      case 'select':
        return this.renderInputSelect(requiredClass, inputDescription, handleBlur);
      case 'textarea':
        return this.renderInputTextArea(requiredClass, inputDescription, handleBlur);
      case 'checkbox':
        return this.renderInputCheckbox(requiredClass, inputDescription);
      case 'date':
        return this.renderInputDate(requiredClass, inputDescription);
      case 'password':
        return this.renderInputPassword(requiredClass, inputDescription, handleBlur);
      case 'toggle':
        return this.renderInputToggle();
      case 'email':
        return this.renderInputEmail(requiredClass, inputDescription, handleBlur);
      case 'search':
        return this.renderInputSearch(requiredClass, inputDescription, handleBlur);
      case 'json':
        return this.renderInputJson(requiredClass, inputDescription, handleBlur);
      case 'image':
        return this.renderInputImage(requiredClass, inputDescription, handleBlur);
      default:
    }

    const addonInput = this.props.addon ?
      <div className={`input-group ${styles.input}`} style={{ marginBottom: '1rem'}}>
        <span className={`input-group-addon ${styles.addon}`}><FormattedMessage id={this.props.addon} /></span>
        {input}
      </div> : input;
    return (
      <div className={`${styles.input} ${this.props.customBootstrapClass || 'col-md-6'} ${requiredClass}`}>
        {label}

        {addonInput}
        <div className={styles.inputDescriptionContainer}>
          <small>{inputDescription}</small>
        </div>
        {this.renderErrors()}
        {spacer}
      </div>
    );
  }

}

SemanticInput.propTypes = {
  addon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  addRequiredInputDesign: PropTypes.bool,
  autoFocus: PropTypes.bool,
  customBootstrapClass: PropTypes.string,
  deactivateErrorHighlight: PropTypes.bool,
  didCheckErrors: PropTypes.bool,
  disabled: PropTypes.bool,
  errors: PropTypes.array,
  inputDescription: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelValues: PropTypes.object,
  linkContent: PropTypes.shape({
    link: PropTypes.string,
    description: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  noErrorsDescription: PropTypes.bool,
  onBlur: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  placeholder: PropTypes.string,
  search: PropTypes.bool,
  selectOptions: PropTypes.array,
  selectOptionsFetchSucceeded: PropTypes.bool,
  tabIndex: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  validations: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};

SemanticInput.defaultProps = {
  addon: false,
  addRequiredInputDesign: false,
  autoFocus: false,
  deactivateErrorHighlight: false,
  didCheckErrors: false,
  disabled: false,
  errors: [],
  inputDescription: '',
  labelValues: {},
  linkContent: {},
  noErrorsDescription: false,
  onBlur: false,
  onFocus: () => {},
  placeholder: '',
  search: false,
  selectOptions: [],
  selectOptionsFetchSucceeded: false,
  tabIndex: '0',
  value: ''
};

export default SemanticInput;
