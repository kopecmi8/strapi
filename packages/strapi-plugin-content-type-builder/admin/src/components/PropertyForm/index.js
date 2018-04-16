import React from 'react';
import PropTypes from 'prop-types';
import {includes, isArray, isEmpty, startCase} from 'lodash';
import cn from 'classnames';

import Input from 'components/InputsIndex';
import Label from 'components/Label';

import styles from './styles.scss';

const SCHEMA = 'http://schema.org/';


class PropertyForm extends React.Component {

  componentDidMount() {
    if(!isArray(this.props.ranges)){
      this.props.onChange({target: {type: 'text', value: this.props.ranges, name: `params.entity.attributes.${this.props.property.replace(SCHEMA, '')}.range`}});
    }
  }

  getAvailableAttributesForRange = () => {
    if(this.props.values.range){
      let attributes = this.props.attributes.filter((attribute) => {
        if (includes(attribute.ranges, this.props.values.range)) return attribute;
      });

      if(this.props.values.range === 'http://schema.org/Text'){
        attributes = attributes.filter((attribute) => {
          if(this.props.property === 'http://schema.org/email') {
            return includes(attribute.type, 'email');
          }else{
            return !includes(attribute.type, 'email');
          }
        });
      }

      if (isEmpty(attributes)) {
        attributes = this.props.attributes.filter((attribute) => {
          if (includes(attribute.type, 'url')) return attribute;
        });

      }

      return attributes;

    }

  };

  renderAttributeSelect = () => {
    const attributes = this.getAvailableAttributesForRange();
    const validations = {required: true};

    if(attributes){
      const property = this.props.property.replace(SCHEMA, '');
      const selectOptions = attributes.map((attribute) => {
        return attribute.type;
      });

      return (
        <Input
          type={'select'}
          label={{id: 'content-type-builder.form.property.attribute'}}
          selectOptions={selectOptions}
          name={`params.entity.attributes.${property}.type`}
          id={`params.entity.attributes.${property}.type`}
          onChange={this.props.onChange}
          value={this.props.values.type}
          customBootstrapClass={'col-md-4'}
          validations={validations}
        />
      );
    }
  }


  renderRangeSelect = () => {
    const property = this.props.property.replace(SCHEMA, '');
    const validations = {required: true};

    if(isArray(this.props.ranges)){
      return (
        <Input
          type={'select'}
          label={{id: 'content-type-builder.form.property.range'}}
          selectOptions={this.props.ranges}
          name={`params.entity.attributes.${property}.range`}
          id={`params.entity.attributes.${property}.range`}
          onChange={this.props.onChange}
          value={this.props.values.range}
          customBootstrapClass={'col-md-4'}
          validations={validations}
        />
      );
    }

    const value = this.props.values.range ? this.props.values.range : this.props.ranges;

    return (
      <Input
        type={'text'}
        label={{id: 'content-type-builder.form.property.range'}}
        disabled
        name={`params.entity.attributes.${property}.range`}
        id={`params.entity.attributes.${property}.range`}
        value={value}
        onChange={this.props.onChange}
        customBootstrapClass={'col-md-4'}
      />
    );

  }

  render () {
    const property = this.props.property.replace(SCHEMA, '');
    const rangeSelect = this.renderRangeSelect();
    const attributeSelect = this.renderAttributeSelect();
    const label = (this.props.values.label !== undefined) ? this.props.values.label : startCase(property);

    return (
      <div
        className={cn(
          'col-md-12',
          styles.propertyForm,
          this.props.className
        )}
      >
        <Label
          htmlFor={property}
          message={{id: 'content-type-builder.form.property', params: {property: this.props.property}}}
          className={styles.propertyLabel}
        />
        <div id={property} >
          <span
            className={styles.closeButton}
            onClick={() => this.props.onRemove(this.props.property)}
          />
          <div className={'row'}>
            <Input
              type={'text'}
              label={{id: 'content-type-builder.form.property.label'}}
              name={`params.entity.attributes.${property}.label`}
              id={`params.entity.attributes.${property}.label`}
              value={label}
              onChange={this.props.onChange}
              customBootstrapClass={'col-md-4'}
            />
            {rangeSelect}
            {attributeSelect}
            <Input
              type={'checkbox'}
              label={{id: 'content-type-builder.form.property.required'}}
              name={`params.entity.attributes.${property}.required`}
              id={`params.entity.attributes.${property}.required`}
              value={this.props.values.required}
              onChange={this.props.onChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

PropertyForm.propTypes = {
  attributes: PropTypes.array.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  ranges: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  values: PropTypes.object,
};

PropertyForm.defaultProps = {
  className: '',
  values: {},
};

export default PropertyForm;