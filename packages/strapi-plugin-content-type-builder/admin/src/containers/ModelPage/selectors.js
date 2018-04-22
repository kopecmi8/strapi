import { createSelector } from 'reselect';

/**
 * Direct selector to the modelPage state domain
 */
const selectModelPageDomain = () => state => state.get('modelPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ModelPage
 */

const selectModelPage = () => createSelector(
  selectModelPageDomain(),
  (substate) => substate.toJS()
);

const makeSelectModel = () => createSelector(
  selectModelPageDomain(),
  (substate) => substate.get('model').toJS(),
);

const makeSelectPostContentTypeSuccess = () => createSelector(
  selectModelPageDomain(),
  (substate) => substate.get('postContentTypeSuccess'),
);

const makeSelectModelLoading = () => createSelector(
  selectModelPageDomain(),
  (substate) => substate.get('modelLoading'),
);

export default selectModelPage;
export {
  selectModelPage,
  selectModelPageDomain,
  makeSelectModel,
  makeSelectPostContentTypeSuccess,
  makeSelectModelLoading,
};
