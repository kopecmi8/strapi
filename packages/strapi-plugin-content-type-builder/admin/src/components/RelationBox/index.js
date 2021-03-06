/**
*
* RelationBox
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Loader from 'react-loader';
import {camelCase, get, isEmpty, map, startCase} from 'lodash';
import pluralize from 'pluralize';
import cn from 'classnames';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Input from 'components/InputsIndex';
import Button from 'components/Button';
import styles from './styles.scss';

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-wrap-multilines */
class RelationBox extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleBlur.bind(this);
    this.state = {
      showMenu: false,
    };
  }

  handleBlur = ({ target }) => {
    this.props.onChange({target: {'name': target.name, 'value': camelCase(target.value)}});
  }

  handleClick = (e) => {
    const value = e.target.id.split('.');
    const target = {
      type: 'string',
      value: value[0],
      name: 'params.target',
    };

    this.props.onChange({ target });

    this.props.onChange({
      target: {
        type: 'string',
        value: value[1] !== 'undefined' ? value[1] : '',
        name: 'params.pluginValue',
      },
    });
  }

  toggle = () => this.setState({ showMenu: !this.state.showMenu });

  renderDropdownMenu = () => (
    <div className={styles.dropDown}>
      <ButtonDropdown isOpen={this.state.showMenu} toggle={this.toggle} style={{ backgroundColor: 'transparent' }}>
        <DropdownToggle caret>
        </DropdownToggle>
        <DropdownMenu className={styles.dropDownContent}>
          {map(this.props.dropDownItems, (value, key) => {
            const id = value.source ? `${value.name}.${value.source}` : `${value.name}. `;
            let divStyle;

            if (get(this.props.header, 'name') === value.name && !isEmpty(get(this.props.header,'source')) && value.source) {
              divStyle = { color: '#323740', fontWeight: 'bold'};
            } else if (value.source === get(this.props.header, 'source') && value.name === get(this.props.header, 'name')) {
              divStyle = { color: '#323740', fontWeight: 'bold'};
            } else {
              divStyle = { color: 'rgba(50,55,64,0.75)' };
            }

            return (
              <div style={{ height: '3.6rem'}} key={key}>
                <DropdownItem onClick={this.handleClick} id={id}>
                  <div style={divStyle} id={`${value.name}.${value.source}`}>
                    <i className={`fa ${value.icon}`} style={divStyle} id={id} />
                    {value.name}&nbsp;
                    {value.source ? (
                      <FormattedMessage id="content-type-builder.from">
                        {(message) => (
                          <span style={{ fontStyle: 'italic' }} id={id}>({message}: {value.source})</span>
                        )}
                      </FormattedMessage>
                    ) : ''}
                  </div>
                </DropdownItem>
              </div>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  )

  render() {
    let placeholder = this.props.value ? this.props.value : '';
    if(this.props.relationType === 'manyToMany' || (this.props.relationType === 'oneToMany' && this.props.isFirstContentType) || (this.props.relationType === 'manyToOne' && !this.props.isFirstContentType)){
      placeholder = startCase(pluralize(placeholder));
    }else{
      placeholder = startCase(pluralize.singular(placeholder));
    }

    const content = isEmpty(this.props.input) ?
      <div /> :
      <Input
        tabIndex={this.props.tabIndex}
        type={get(this.props.input, 'type')}
        onChange={this.props.onChange}
        onBlur={this.handleBlur}
        label={get(this.props.input, 'label')}
        name={get(this.props.input, 'name')}
        value={this.props.value}
        selectOptions={get(this.props.input, 'items')}
        disabled={get(this.props.input, 'disabled')}
        customBootstrapClass="col-md-12"
        validations={get(this.props.input, 'validations')}
        errors={this.props.errors}
        didCheckErrors={this.props.didCheckErrors}
        pluginID="content-type-builder"
        autoFocus={this.props.autoFocus}
      />;

    const labelInput = isEmpty(this.props.labelInput) ?
      '' :
      <Input
        tabIndex={this.props.tabIndex}
        type={get(this.props.labelInput, 'type')}
        onChange={this.props.onChange}
        label={get(this.props.labelInput, 'label')}
        name={get(this.props.labelInput, 'name')}
        value={this.props.label}
        customBootstrapClass="col-md-12"
        placeholder={placeholder}
        validations={get(this.props.labelInput, 'validations')}
        pluginID="content-type-builder"
        autoFocus={this.props.autoFocus}
      />;

    const dropDown = !isEmpty(this.props.dropDownItems) ? this.renderDropdownMenu() : '';

    if (isEmpty(this.props.dropDownItems) && this.props.tabIndex === '2'){
      return (
        <div className={styles.relationBox}>
          <div className={styles.headerContainer}>
            <FormattedMessage id="content-type-builder.popUpRelation.noEntity.title" />
          </div>
          <div
            className={styles.inputContainer}
          >
            <div
              className={cn(
                'container-fluid',
                styles.noEntity,
              )}
            >
              <FormattedMessage id="content-type-builder.popUpRelation.noEntity.description" />
              <Button kind="primaryAddShape" primary onClick={this.props.onCreateContentType} ><FormattedMessage id="content-type-builder.popUpRelation.noEntity.button" /></Button>
            </div>
          </div>
        </div>
      );
    }else if(!this.props.isLoaded){
      return (
        <div className={styles.relationBox}>
          <div className={styles.headerContainer}>
            <FormattedMessage id="content-type-builder.popUpRelation.loading.title" />
          </div>
          <div
            className={styles.inputContainer}
          >
            <div
              className={cn(
                'container-fluid',
                styles.loading,
              )}
            >
              <Loader loaded={this.props.isLoaded} />
              <FormattedMessage id="content-type-builder.popUpRelation.loading.description" />
            </div>
          </div>
        </div>
      );
    }else {
      return (
        <div className={styles.relationBox}>
          <div className={styles.headerContainer}>
            <i className={`fa ${get(this.props.header, 'icon')}`} />
            {startCase(get(this.props.header, 'name'))}&nbsp;
            <span style={{ fontStyle: 'italic', fontWeight: '500' }}>
              {get(this.props.header, 'source') ? (
                `(${get(this.props.header, 'source')})`
              ): ''}
            </span>
            {dropDown}
          </div>
          <div className={styles.inputContainer}>
            <form onSubmit={this.props.onSubmit}>
              <div className="container-fluid">
                <div className={`row ${styles.input}`}>
                  {content}
                  {labelInput}
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

RelationBox.propTypes = {
  autoFocus: PropTypes.bool,
  didCheckErrors: PropTypes.bool.isRequired,
  dropDownItems: PropTypes.array,
  errors: PropTypes.array,
  header: PropTypes.object,
  input: PropTypes.object,
  isFirstContentType: PropTypes.bool,
  isLoaded: PropTypes.bool.isRequired,
  label: PropTypes.string,
  labelInput: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onCreateContentType: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  relationType: PropTypes.string,
  tabIndex: PropTypes.string.isRequired,
  value: PropTypes.string,
};

RelationBox.defaultProps = {
  autoFocus: false,
  dropDownItems: [],
  errors: [],
  header: {},
  input: {},
  isFirstContentType: false,
  label: '',
  labelInput: {},
  relationType: 'oneToOne',
  value: '',
};

export default RelationBox;
