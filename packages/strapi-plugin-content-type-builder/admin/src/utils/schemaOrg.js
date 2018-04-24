/**
 *
 * Utils to convert Schema.org properties from/to URL
 *
 */

import { replace, includes } from 'lodash';

export const SCHEMA_ORG = 'http://schema.org/';
export const SCHEMA_EMAIL = 'http://schema.org/email';
export const SCHEMA_TEXT = 'http://schema.org/Text';
export const SCHEMA_URL = 'http://schema.org/URL';
export const SCHEMA_DATE = 'http://schema.org/Date';
export const SCHEMA_DATE_TIME = 'http://schema.org/DateTime';
export const SCHEMA_TIME = 'http://schema.org/Time';
export const SCHEMA_NUMBER = 'http://schema.org/Number';
export const SCHEMA_FLOAT = 'http://schema.org/Float';
export const SCHEMA_INTEGER = 'http://schema.org/Integer';
export const SCHEMA_BOOLEAN = 'http://schema.org/Boolean';
export const SCHEMA_FALSE = 'http://schema.org/False';
export const SCHEMA_TRUE = 'http://schema.org/True';


export const schemaOrg = {

  replace(property) {
    return replace(property, SCHEMA_ORG, '');
  },

  makeURL(propertyName) {
    return  `${SCHEMA_ORG}${propertyName}`;
  },

  isPrimitiveProperty(propertyName){
    const primitiveProperites = [
      SCHEMA_TEXT,
      SCHEMA_URL,
      SCHEMA_DATE,
      SCHEMA_DATE_TIME,
      SCHEMA_TIME,
      SCHEMA_NUMBER,
      SCHEMA_FLOAT,
      SCHEMA_INTEGER,
      SCHEMA_BOOLEAN,
      SCHEMA_FALSE,
      SCHEMA_TRUE,
    ];

    return includes(primitiveProperites, propertyName);
  },
};

export default schemaOrg;