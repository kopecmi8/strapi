import { includes, mapKeys, reject } from 'lodash';
/**
 * [validateInput description]
 * @param  {String || Number} value  Input's value
 * @param  {Object} inputValidations
 * @param  {String} [type='text']    Optionnal: the input's type only for email
 * @return {Array}                  Array of errors to be displayed
 */

/* eslint-disable no-useless-escape */
const validateInput = (value, inputValidations = {}, type = 'text') => {
  let errors = [];

  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  const urlRegex = new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);

  // handle i18n
  const requiredError = { id: 'components.Input.error.validation.required' };

  mapKeys(inputValidations, (validationValue, validationKey) => {
    switch (validationKey) {
      case 'max':
        if (parseInt(value, 10) > validationValue) {
          errors.push({ id: 'components.Input.error.validation.max' });
        }
        break;
      case 'maxLength':
        if (value.length > validationValue) {
          errors.push({ id: 'components.Input.error.validation.maxLength' });
        }
        break;
      case 'min':
        if (parseInt(value, 10) < validationValue) {
          errors.push({ id: 'components.Input.error.validation.min' });
        }
        break;
      case 'minLength':
        if (value.length < validationValue) {
          errors.push({ id: 'components.Input.error.validation.minLength' });
        }
        break;
      case 'required':
        if (value.length === 0) {
          errors.push({ id: 'components.Input.error.validation.required' });
        }
        break;
      case 'regex':
        if (!new RegExp(validationValue).test(value)) {
          errors.push({ id: 'components.Input.error.validation.regex' });
        }
        break;
      default:
        errors = [];
    }
  });

  if (type === 'email' && !emailRegex.test(value)) {
    errors.push({ id: 'components.Input.error.validation.email' });
  }

  if (type === 'url' && !urlRegex.test(value)) {
    errors.push({ id: 'components.Input.error.validation.url' });
  }

  if (includes(errors, requiredError)) {
    errors = reject(errors, (error) => error !== requiredError);
  }

  return errors;
};

export default validateInput;
