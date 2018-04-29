/**
 *
 * PopUpEntity
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {findIndex, get, includes, isEmpty, map, split, find, join, pickBy } from 'lodash';
import { fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Input from 'components/InputsIndex';
import PropertyForm from 'components/PropertyForm';
import schemaOrg from '../../utils/schemaOrg';
import styles from './styles.scss';

class PopUpEntity extends React.Component {

  componentDidMount() {
    if(!isEmpty(this.props.type)) {
      this.props.onChange({target: {type: 'text', value: this.props.type, name: 'params.entity.@type'}});
    }
    this.handleChange.bind(this);
  }

  createComponent = (el) => {
    if (get(el, ['inputDescription', 'params', 'link', 'children', 'type'], '') === 'FormattedMessage') {
      return (
        <FormattedMessage id={get(el, ['inputDescription', 'params', 'link', 'children', 'attr', 'id'], 'default')} defaultMessage=" ">
          {(message) => (
            React.createElement(
              // Create the wrapper component
              // This line will create the link
              get(el, ['inputDescription', 'params', 'link', 'parent', 'type'], 'span'),
              // Set the attributes
              get(el, ['inputDescription', 'params', 'link', 'parent', 'attr'], ''),
              message,
            )
          )}
        </FormattedMessage>
      );
    }

    return (
      React.createElement(
        get(el, ['inputDescription', 'params', 'link', 'parent', 'type'], 'span'),
        // Set the attributes
        get(el, ['inputDescription', 'params', 'link', 'parent', 'attr'], ''),
        React.createElement(
          get(el, ['inputDescription', 'params', 'link', 'children', 'type'], 'span'),
          get(el, ['inputDescription', 'params', 'link', 'children', 'attr'], ''),
          get(el, ['inputDescription', 'params', 'link', 'children', 'innerHTML'], ''),
        )
      )
    );
  }

  handleChange = ({target}) => {
    if(target.name === 'params.properties'){
      const values = split(target.value, ',');
      const attributes = pickBy(this.props.values.params.entity.attributes, (value, key) => includes(values.map((value) => schemaOrg.replace(value)), key));
      this.props.onChange({target: {type: 'text', name: 'params.entity.attributes', value: fromJS(attributes)}});
    }
    this.props.onChange({target});
  }

  handleRemoveProperty = (property) => {
    let values = split(this.props.values.params.properties, ',');
    values = values.filter((value) => value !== property);
    const formattedValues = join(values, ',');
    const attributes = pickBy(this.props.values.params.entity.attributes, (value, key) => includes(values.map((value) => schemaOrg.replace(value)), key));

    this.props.onChange({target: {type: 'multiSelect', name: 'params.properties', value: formattedValues}});
    this.props.onChange({target: {type: 'text', name: 'params.entity.attributes', value: fromJS(attributes)}});
  }

  renderInput = (item, key) => {
    const customBootstrapClass = item.type === 'multiSelect' ? 'col-md-12' : 'col-md-6';
    const value = !isEmpty(this.props.values) && includes(item.name, '.') ? get(this.props.values, [split(item.name, '.')[0], split(item.name, '.')[1]]) : this.props.values[item.name];
    const errorIndex = findIndex(this.props.formErrors, ['name', item.name]);
    const errors = errorIndex !== -1 ? this.props.formErrors[errorIndex].errors : [];
    const inputDescription = {
      id: get(item, ['inputDescription', 'id'], ''),
      params: {
        link: this.createComponent(item),
      },
    };

    //prefilled label
    if(item.name === 'params.label'){
      item.placeholder = get(this.props.values, 'name');
    }

    return (
      <Input
        key={key}
        type={item.type}
        onChange={this.handleChange}
        onBlur={this.props.onBlur}
        label={item.label}
        multi={item.multi}
        name={item.name}
        validations={item.validations}
        inputDescription={inputDescription}
        value={value}
        customBootstrapClass={customBootstrapClass}
        selectOptions={item.items}
        placeholder={item.placeholder}
        title={item.title}
        disabled={item.disabled}
        errors={errors}
        isLoading={this.props.showLoader}
        didCheckErrors={this.props.didCheckErrors}
        autoFocus={key === 0 && item.type !== 'date'}
      />
    );
  }

  renderPropertiesForm = () => {
    if(this.props.values.params && this.props.values.params.properties) {
      return map(split(this.props.values.params.properties, ','), (property) => {
        const propertyValue = find(this.props.properties, (item) => {
          return item['@id'] == property;
        });
        const ranges = propertyValue ? propertyValue.rangeIncludes : [];

        let values = {};
        if(this.props.values.params.entity) {
          values = get(this.props.values.params.entity.attributes, schemaOrg.replace(property));
        }

        return (
          <PropertyForm
            attributes={this.props.attributes}
            key={property}
            property={property}
            ranges={ranges}
            onChange={this.props.onChange}
            onRemove={this.handleRemoveProperty}
            values={values}
          />
        );
      });
    }
    return;
  }

  render() {
    const loader = this.props.showLoader ?
      <Button onClick={this.props.onSubmit} type="submit" className={styles.primary} disabled={this.props.showLoader}><p className={styles.saving}><span>.</span><span>.</span><span>.</span></p></Button>
      : <Button type="submit" onClick={this.props.onSubmit} className={styles.primary}><FormattedMessage id="content-type-builder.form.button.continue" /></Button>;

    const form = map(this.props.form.items, (item) => {
      if(item.name === 'params.properties') item.items = map(this.props.properties, (item) => {return {label: item['label'], value: item['@id']};});
      return item;
    });

    const baseForm = map(form, (item, key ) => this.renderInput(item, key));
    const propertiesForm = this.renderPropertiesForm();
    const handleToggle = this.props.toggle;

    return (
      <div className={styles.popUpRelations}>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={`${styles.modalPosition}`}>
          <ModalHeader toggle={this.props.toggle} className={styles.popUpFormHeader} />
          <div className={styles.headerContainer}>
            <div className={styles.titleContainer}>
              <div>
                <FormattedMessage id={this.props.popUpTitle} />
                &nbsp;
                <FormattedMessage id="content-type-builder.popUpEntity.title" />
              </div>
            </div>
          </div>
          <ModalBody className={styles.modalBody} style={{paddingTop: '2.3rem'}}>
            <form onSubmit={this.props.onSubmit}>
              <div className="container-fluid">
                <div className={'row'}>
                  {baseForm}
                </div>
                <div className={'row'}>
                  {propertiesForm}
                </div>
              </div>
            </form>
          </ModalBody>

          <ModalFooter className={styles.modalFooter}>
            <Button onClick={handleToggle} className={styles.secondary}><FormattedMessage id="content-type-builder.form.button.cancel" /></Button>
            {loader}{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

PopUpEntity.propTypes = {
  attributes: PropTypes.array.isRequired,
  didCheckErrors: PropTypes.bool,
  form: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  formErrors: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  isOpen: PropTypes.bool.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  popUpTitle: PropTypes.string.isRequired,
  properties: PropTypes.array.isRequired,
  showLoader: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  values: PropTypes.object,
};

PopUpEntity.defaultProps = {
  didCheckErrors: false,
  formErrors: [],
  showLoader: false,
  properties: [],
  values: {},
};

export default PopUpEntity;