/**
 *
 * InputEntityWithErrors
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import update from 'react-addons-update';
import cn from 'classnames';
import {
  differenceBy,
  get,
  isEmpty,
  startCase,
} from 'lodash';


// Design
import Label from 'components/Label';
import InputSpacer from 'components/InputSpacer';
import Input from 'components/InputsIndex';

import {getInputType} from 'components/Edit';

import styles from './styles.scss';

class InputEntityWithErrors extends React.Component {
  state = { label: false, hasValue: false };

  componentDidMount() {
    if (this.props.multiple && !isEmpty(this.props.value)) {
      this.setState({ label: 1, hasValue: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.hasValue && !isEmpty(nextProps.value) && nextProps.multiple && differenceBy(nextProps.value, this.props.value, 'name').length > 0) {
      this.setState({ label: 1, hasValue: true });
    }
  }

  setLabel = (label) => {
    this.setState({ label });
  }

  orderAttributes = (displayedFields) => Object.keys(displayedFields);

  // TODO handle errors lifecycle
  render() {
    const {
      className,
      entity,
      inputDescription,
      label,
      labelClassName,
      labelStyle,
      name,
      onChange,
      style,
      value,
    } = this.props;

    const labelClass = labelClassName === '' ? styles.label : labelClassName;
    const spacer = isEmpty(inputDescription) ? <InputSpacer /> : <div />;

    return (
      <div
        className={cn(
          styles.inputEntityWithErrorsContainer,
          'col-md-12',
          className !== '' && className,
        )}
        style={style}
      >
        <Label
          className={labelClass}
          htmlFor={`${name}NotNeeded`}
          message={label}
          style={labelStyle}
        />
        { this.state.label && (
          <span className={styles.labelNumber}>&nbsp;({this.state.label}/{value.length})</span>
        )}

        <div
          className={cn(
            styles.inputsContainer,
            'row',
          )}
        >
          {this.orderAttributes(entity.attributes).map((attr) => {
            const details = entity.attributes[attr];
            const label = !isEmpty(get(details, 'label')) ? get(details, 'label') : startCase(attr);

            return (
              <Input
                type={getInputType(details.type)}
                label={label}
                labelStyle={{fontSize: '.9em'}}
                onChange={onChange}
                name={`${name}.${attr}`}
                value={value[attr]}
                key={`${name}.${attr}`}
                entity={get(details, 'entity')}
              />
            );
          })}
        </div>
        {spacer}
      </div>
    );
  }
}

InputEntityWithErrors.defaultProps = {
  className: '',
  customBootstrapClass: 'col-md-6',
  inputDescription: '',
  inputDescriptionClassName: '',
  inputDescriptionStyle: {},
  label: '',
  labelClassName: '',
  labelStyle: {},
  multiple: false,
  style: {},
  value: [],
  entity: {},
};

InputEntityWithErrors.propTypes = {
  className: PropTypes.string,
  entity: PropTypes.object,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
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
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default InputEntityWithErrors;
