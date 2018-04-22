import pluralize from 'pluralize';
import {capitalize, findIndex, get, isEmpty, replace, sortBy} from 'lodash';
import { takeLatest, call, put, fork, select } from 'redux-saga/effects';
import request from 'utils/request';

import {
  SUBMIT_ACTION_SUCCEEDED,
} from '../ModelPage/constants';

import {
  connectionsFetchSucceeded,
  contentTypeActionSucceeded,
  contentTypeFetchSucceeded,
  resetComponent,
  setButtonLoading,
  setForm,
  typesFetchSucceeded,
  rangePropertiesFetch,
  rangePropertiesFetchSucceeded,
  unsetButtonLoading,
} from './actions';

import {
  CONTENT_TYPE_EDIT,
  CONTENT_TYPE_FETCH,
  SET_ATTRIBUTE_FORM,
  SET_ATTRIBUTE_FORM_EDIT,
  PREPARE_FORM,
} from './constants';

import {
  makeSelectInitialDataEdit,
  makeSelectModifiedDataEdit,
} from './selectors';

const requestURLBase = '/content-type-builder';

export function* editContentType(action) {
  try {
    const initialContentType = yield select(makeSelectInitialDataEdit());
    const requestUrl = `${requestURLBase}/models/${initialContentType.name}`;
    const body = yield select(makeSelectModifiedDataEdit());
    const opts = {
      method: 'PUT',
      body,
    };

    yield put(setButtonLoading());

    const leftMenuContentTypes = get(action.context.plugins.toJS(), ['content-manager', 'leftMenuSections']);
    const leftMenuContentTypesIndex = !isEmpty(leftMenuContentTypes) ? findIndex(get(leftMenuContentTypes[0], 'links'), ['destination', initialContentType.name.toLowerCase()]) : -1;
    const response = yield call(request, requestUrl, opts, true);

    if (response.ok) {
      yield put(contentTypeActionSucceeded());
      yield put(unsetButtonLoading());

      // Update admin left menu content types section
      if (leftMenuContentTypesIndex !== -1) {
        const name = body.name.toLowerCase();
        const updatedSectionLink = {
          destination: name,
          label: capitalize(pluralize(name)),
        };

        leftMenuContentTypes[0].links.splice(leftMenuContentTypesIndex, 1, updatedSectionLink);
        leftMenuContentTypes[0].links = sortBy(leftMenuContentTypes[0].links, 'label');
        action.context.updatePlugin('content-manager', 'leftMenuSections', leftMenuContentTypes);
      }
      strapi.notification.success('content-type-builder.notification.success.message.contentType.edit');
    }
  } catch(error) {
    strapi.notification.error(get(error, ['response', 'payload', 'message'], 'notification.error'));
  }
}

export function* fetchConnections() {
  try {
    const requestUrl = `${requestURLBase}/connections`;
    const data = yield call(request, requestUrl, { method: 'GET' });

    yield put(connectionsFetchSucceeded(data));

  } catch(error) {
    strapi.notification.error('content-type-builder.notification.error.message');
  }
}

export function* fetchContentType(action) {
  try {
    const requestUrl = `${requestURLBase}/models/${action.contentTypeName.split('&source=')[0]}`;
    const params = {};
    const source = action.contentTypeName.split('&source=')[1];

    if (source) {
      params.source = source;
    }

    const data = yield call(request, requestUrl, { method: 'GET', params });

    yield put(contentTypeFetchSucceeded(data));

  } catch(error) {
    strapi.notification.error('content-type-builder.notification.error.message');
  }
}

export function* fetchConnectionsAndTypes(action) {
  const typesRequestURL = `${requestURLBase}/types`;
  const types = yield call(request, typesRequestURL, { method: 'GET' });

  const connectionsRequestUrl = `${requestURLBase}/connections`;
  const connections = yield call(request, connectionsRequestUrl, { method: 'GET' });

  yield put(connectionsFetchSucceeded(connections));

  yield put(typesFetchSucceeded(types));

  yield put(setForm(action.hash));
}

export function* fetchRangeProperties(action) {
  yield put(rangePropertiesFetch());
  const range = replace(action.attribute.get('params').get('range'), 'http://schema.org/', '');
  const requestURL = `${requestURLBase}/properties/${range}`;
  const data = yield call(request, requestURL, { method: 'GET' });

  yield put(rangePropertiesFetchSucceeded(data));
}

export function* resetFormComponent() {
  yield put(resetComponent());
}

function* defaultSaga() {
  yield fork(takeLatest, CONTENT_TYPE_EDIT, editContentType);
  yield fork(takeLatest, CONTENT_TYPE_FETCH, fetchContentType);
  yield fork(takeLatest, SET_ATTRIBUTE_FORM, fetchRangeProperties);
  yield fork(takeLatest, SET_ATTRIBUTE_FORM_EDIT, fetchRangeProperties);
  yield fork(takeLatest, PREPARE_FORM, fetchConnectionsAndTypes);
  yield fork(takeLatest, SUBMIT_ACTION_SUCCEEDED, resetFormComponent);
}

export default defaultSaga;
