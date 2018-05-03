import React from 'react';
import PropTypes from 'prop-types';
import {isArray, includes, isEmpty, map} from 'lodash';
import { FormattedMessage } from 'react-intl';
import {router} from 'app';

//components
import AttributeCard from 'components/AttributeCard';
import Input from 'components/InputsIndex';
import Label from 'components/Label';
import { SCHEMA_EMAIL, SCHEMA_TEXT } from '../../utils/schemaOrg';


class PropertiesForm extends React.Component {

  constructor() {
    super();

    this.handleSelectProperty.bind(this);
  }

  getRangesFromProperty = (property) => {
    const id = property ? property : this.props.property;
    return this.props.properties.find(i => i['@id'] == id);
  };

  getAvailableAttributesForRange = () => {
    let attributes = this.props.attributes.filter((attribute) => {
      if (includes(attribute.ranges, this.props.range)) {
        return attribute;
      }
    });

    if(this.props.range === SCHEMA_TEXT){
      attributes = attributes.filter((attribute) => {
        if (this.props.property === SCHEMA_EMAIL) {
          return includes(attribute.type, 'email');
        } else {
          return !includes(attribute.type, 'email');
        }
      });
    }

    if (isEmpty(attributes)) {
      attributes = this.props.attributes.filter((attribute) => {
        if (includes(attribute.ranges, 'all')) {
          return attribute;
        }
      });
    }

    return attributes;
  };

  goToAttributeTypeView = (attributeType) => {
    const settings = attributeType === 'relation' ? 'defineRelation' : 'baseSettings';
    router.push(`${this.props.routePath}#create${this.props.modelName}::attribute${attributeType}::${settings}`);
  };

  handleSelectProperty = ({target}) => {

    this.props.handleSelectProperty({target});
    const ranges = this.getRangesFromProperty(target.value).rangeIncludes;


    if (!isArray(ranges)) {
      this.props.handleSelectRange({target: {value: ranges}});
    }
  };

  renderRangesSelect = () => {
    const ranges = this.getRangesFromProperty().rangeIncludes;


    if (!isArray(ranges)) {
      return (
        <Input
          key='ranges'
          type='text'
          onChange={this.props.handleSelectRange}
          disabled
          label={{id: 'content-type-builder.form.properties.range'}}
          name='ranges'
          value={this.props.range}
          customBootstrapClass='col-md-6'
        />
      );
    }

    return (
      <Input
        key='ranges'
        type='select'
        onChange={this.props.handleSelectRange}
        label={{id: 'content-type-builder.form.properties.range'}}
        name='ranges'
        value={this.props.range}
        selectOptions={ranges}
        customBootstrapClass='col-md-6'
      />
    );
  };


  renderAttributeSelect = () => {
    const attributes = this.getAvailableAttributesForRange();

    return (
      <div className='col-md-12 row'>
        <Label
          message={{id: 'content-type-builder.form.properties.attribute'}}
          className='col-md-12'
        />
        {map(attributes, (attribute, key) => (
          <AttributeCard
            key={key}
            attribute={attribute}
            autoFocus={key === 0}
            routePath={this.props.routePath}
            handleClick={this.goToAttributeTypeView}
            tabIndex={key}
          />
        ))}
      </div>
    );
  };


  render() {
    const selectOptions = this.props.properties.
      map((item) => {
        return {
          label: item['label'],
          value: item['@id'],
        };
      }).
      filter((item) => !includes(this.props.usedProperties, item.label) );


    const rangesSelect = this.props.property ? this.renderRangesSelect() : '';
    const attributeSelect = this.props.property && this.props.range ? this.renderAttributeSelect() : '';
    const inputDescription = !isEmpty(this.props.type) ? {
      id: 'content-type-builder.form.properties.property.description',
      params: {
        link: (
          <a
            href={this.props.type}
            target="_blank"
          >
            <FormattedMessage id='content-type-builder.form.properties.property.link.properties' defaultMessage='' />
          </a>
        ),
      },
    } : '';

    return (
      <div className='col-md-12 row'>
        <Input
          key='properties'
          type='multiSelect'
          isLoading={this.props.showLoader}
          onChange={this.handleSelectProperty}
          label={{id: 'content-type-builder.form.properties.property'}}
          inputDescription={inputDescription}
          name='properties'
          value={this.props.property}
          customBootstrapClass='col-md-6'
          selectOptions={selectOptions}
          autoFocus
        />
        {rangesSelect}
        {attributeSelect}
      </div>
    );
  }
}

PropertiesForm.propTypes = {
  attributes: PropTypes.array.isRequired,
  handleSelectProperty: PropTypes.func.isRequired,
  handleSelectRange: PropTypes.func.isRequired,
  modelName: PropTypes.string.isRequired,
  properties: PropTypes.array.isRequired,
  property: PropTypes.string,
  range: PropTypes.string,
  routePath: PropTypes.string.isRequired,
  showLoader: PropTypes.bool.isRequired,
  type: PropTypes.string,
  usedProperties: PropTypes.array.isRequired,
};

PropertiesForm.defaultProps = {
  property: '',
  range: '',
  type: '',
};

export default PropertiesForm;