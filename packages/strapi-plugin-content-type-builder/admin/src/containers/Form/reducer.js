/*
 *
 * Form reducer
 *
 */

import { fromJS, List, Map } from 'immutable';
import { findIndex, isArray } from 'lodash';
import schemaOrg from '../../utils/schemaOrg';
import {
  CHANGE_INPUT,
  CHANGE_INPUT_ATTRIBUTE,
  CONNECTIONS_FETCH_SUCCEEDED,
  CONTENT_TYPE_ACTION_SUCCEEDED,
  CONTENT_TYPE_CREATE,
  CONTENT_TYPE_FETCH_SUCCEEDED,
  RANGE_PROPERTIES_FETCH,
  RANGE_PROPERTIES_FETCH_SUCCEEDED,
  REMOVE_CONTENT_TYPE_REQUIRED_ERROR, RESET_COMPONENT_STATE,
  RESET_FORM_ERRORS,
  RESET_IS_FORM_SET,
  SET_ATTRIBUTE_FORM,
  SET_ATTRIBUTE_FORM_EDIT,
  SET_BUTTON_LOADING,
  SET_FORM,
  SET_FORM_ERRORS,
  SET_PROPERTY,
  SET_RANGE,
  TYPES_FETCH_SUCCEEDED,
  UNSET_BUTTON_LOADING,
} from './constants';

/* eslint-disable new-cap */

const initialState = fromJS({
  didCheckErrors: false,
  connections: List(),
  form: List(),
  formValidations: List(),
  formErrors: List(),
  initialData: Map(),
  initialDataEdit: Map(),
  modifiedDataAttribute: Map(),
  modifiedData: Map(),
  modifiedDataEdit: Map(),
  isFormSet: false,
  isRangePropertiesFetched: false,
  property: '',
  range: '',
  rangeProperties: List(),
  shouldRefetchContentType: false,
  types: List(),
  updatedContentType: false,
  showButtonLoading: false,
});

function formReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_INPUT:
      return state
        .updateIn([action.objectToModify, action.key], () => action.value);
    case CHANGE_INPUT_ATTRIBUTE: {
      return state.updateIn(action.keys, () => action.value);
    }
    case CONNECTIONS_FETCH_SUCCEEDED:
      return state
        .set('connections', List(action.connections));
    case CONTENT_TYPE_ACTION_SUCCEEDED:
      return state
        .set('shouldRefetchContentType', !state.get('shouldRefetchContentType'))
        .set('initialDataEdit', state.get('modifiedDataEdit'))
        .set('updatedContentType', !state.get('updatedContentType'))
        // .set('property', '')
        // .set('rangeProperties', List())
        // .set('range', '')
        .set('isFormSet', false);
    case CONTENT_TYPE_CREATE: {
      if (action.shouldSetUpdatedContentTypeProp) {
        return state
          .set('isFormSet', false)
          .set('modifiedData', Map())
          .set('updatedContentType', !state.get('updatedContentType'));
      }

      return state
        .set('isFormSet', false)
        .set('modifiedData', Map());
    }
    case CONTENT_TYPE_FETCH_SUCCEEDED:
      return state
        .set('initialDataEdit', action.data)
        .set('modifiedDataEdit', action.data);
    case RANGE_PROPERTIES_FETCH:
      return state
        .set('rangeProperties', List())
        .set('isRangePropertiesFetched', false);
    case RANGE_PROPERTIES_FETCH_SUCCEEDED:
      return state
        .set('rangeProperties', action.rangeProperties)
        .set('isRangePropertiesFetched', true);
    case REMOVE_CONTENT_TYPE_REQUIRED_ERROR:
      return state
        .update('formErrors', (list) => list.splice(findIndex(state.get('formErrors').toJS(), ['target', 'name']), 1))
        .set('didCheckErrors', !state.get('didCheckErrors'));
    case RESET_COMPONENT_STATE:
      return state
        .set('property', '')
        .set('range', '');
    case RESET_FORM_ERRORS:
      return state.set('formErrors', List());
    case RESET_IS_FORM_SET:
      return state
        .set('isFormSet', false)
        .set('property', '');
    case SET_ATTRIBUTE_FORM: {
      if (state.get('isFormSet')) {
        return state
          .set('form', Map(action.form))
          .set('didCheckErrors', !state.get('didCheckErrors'));
      }

      return state
        .set('isFormSet', true)
        .set('form', Map(action.form))
        .set('formValidations', List(action.formValidations))
        .set('modifiedDataAttribute', action.attribute);
    }
    case SET_ATTRIBUTE_FORM_EDIT: {
      if (state.get('isFormSet')) {
        return state
          .set('form', Map(action.form))
          .set('didCheckErrors', !state.get('didCheckErrors'));
      }

      return state
        .set('isFormSet', true)
        .set('form', Map(action.form))
        .set('formValidations', List(action.formValidations))
        .set('modifiedDataAttribute', action.attribute);
    }
    case SET_BUTTON_LOADING:
      return state.set('showButtonLoading', true);
    case TYPES_FETCH_SUCCEEDED:
      return state.set('types', List(action.types));
    case UNSET_BUTTON_LOADING:
      return state.set('showButtonLoading', false);
    case SET_FORM: {
      //load async select options from states
      const form = {
        items: action.form.items.map((item) => {
          if(item.type == 'select' || item.type == 'multiSelect'){
            if(!isArray(item.items)){
              item.items = state.get(item.items).toArray();
            }
          }
          return item;
        }),
      };

      if (state.get('isFormSet')) {
        if(action['@type'] !== undefined) {
          return state
            .set('form', Map(form))
            .updateIn(['modifiedData', '@type'], () => schemaOrg.makeURL(action['@type']));
        }else{
          return state.set('form', Map(form));
        }
      }

      return state
        .set('isFormSet', true)
        .set('form', Map(form))
        .set('formValidations', List(action.formValidations))
        .set('initialData', action.data)
        .set('modifiedData', action.data);
    }
    case SET_FORM_ERRORS:
      return state
        .set('formErrors', List(action.formErrors))
        .set('didCheckErrors', !state.get('didCheckErrors'));
    case SET_PROPERTY:
      return state
        .set('property', action.property)
        .set('range', '');
    case SET_RANGE:
      return state.set('range', action.range);
    default:
      return state;
  }
}

export default formReducer;
