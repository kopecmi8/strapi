'use strict';

const _ = require('lodash');

/**
 * A set of functions called "actions" for `ContentManager`
 */

module.exports = {
  fetchAll: async (params, query) => {
    const { limit, skip = 0, sort, query : request, queryAttribute, source, page, populate = [] } = query;

    // Find entries using `queries` system
    return await strapi.query(params.model, source).find({
      limit,
      skip,
      sort,
      where: request,
      queryAttribute,
    }, populate);
  },

  count: async (params, source) => {
    return await strapi.query(params.model, source).count();
  },

  fetch: async (params, source, populate, raw = true) => {
    return await strapi.query(params.model, source).findOne({
      id: params.id
    }, populate, raw);
  },

  add: async (params, values, source) => {
    // Multipart/form-data.
    if (values.hasOwnProperty('fields') && values.hasOwnProperty('files')) {
      // Silent recursive parser.
      const parser = (value) => {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Silent.
        }

        return _.isArray(value) ? value.map(obj => parser(obj)) : value;
      };

      //recursive context finder
      const context = (value, currentNode) => {

        if(_.get(currentNode, 'type') === 'entity'){

          let values = Object.keys(value).reduce((acc, current) => {
            if(current != '@context' &&  current != '@type') {
              acc[current] = context(value[current], _.get(currentNode, ['entity', 'attributes', current]))
            }

            return acc;
          }, {});

          if(_.get(currentNode, ['entity', '@context'])) {
            values['@context'] = _.get(currentNode, ['entity', '@context']);
          }
          values['@type'] = _.get(currentNode, ['entity', '@type']);
          return values;

        }else{
          return value;
        }
      };

      const model = strapi.plugins['content-manager'].services['contentmanager'].getModel(params, source);
      const files = values.files;

      // Parse stringify JSON data.
      values = Object.keys(values.fields).reduce((acc, current) => {
        let value = parser(values.fields[current]);
        const currentNode = _.get(model, ['attributes', current]);
        acc[current] = context(value, currentNode);

        return acc;
      }, {});

      //add context and type
      values['@context'] = _.get(model, '@context');
      values['@type'] = _.get(model, '@type');

      // Update JSON fields.
      const entry = await strapi.query(params.model, source).create({
        values
      });

      // Then, request plugin upload.
      if (strapi.plugins.upload && Object.keys(files).length > 0) {
        // Upload new files and attach them to this entity.
        await strapi.plugins.upload.services.upload.uploadToEntity({
          id: entry.id || entry._id,
          model: params.model
        }, files, source);
      }

      return strapi.query(params.model, source).findOne({
        id: entry.id || entry._id
      });
    }

    // Create an entry using `queries` system
    return await strapi.query(params.model, source).create({
      values
    });
  },

  edit: async (params, values, source) => {
    // Multipart/form-data.
    if (values.hasOwnProperty('fields') && values.hasOwnProperty('files')) {
      // Silent recursive parser.
      const parser = (value) => {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Silent.
        }

        return _.isArray(value) ? value.map(obj => parser(obj)) : value;
      };

      //recursive context finder
      const context = (value, currentNode) => {

        if(_.get(currentNode, 'type') === 'entity'){

          let values = Object.keys(value).reduce((acc, current) => {
            if(current != '@context' &&  current != '@type') {
              acc[current] = context(value[current], _.get(currentNode, ['entity', 'attributes', current]))
            }

            return acc;
          }, {});

          if(_.get(currentNode, ['entity', '@context'])) {
            values['@context'] = _.get(currentNode, ['entity', '@context']);
          }
          values['@type'] = _.get(currentNode, ['entity', '@type']);
          return values;

        }else{
          return value;
        }
      };

      //model of entity
      const model = strapi.plugins['content-manager'].services['contentmanager'].getModel(params, source);
      const files = values.files;


      // Parse stringify JSON data.
      values = Object.keys(values.fields).reduce((acc, current) => {
        let value = parser(values.fields[current]);
        const currentNode = _.get(model, ['attributes', current]);
        acc[current] = context(value, currentNode);

        return acc;
      }, {});

      values['@context'] = _.get(model, '@context');
      values['@type'] = _.get(model, '@type');


      // Update JSON fields.
      await strapi.query(params.model, source).update({
        id: params.id,
        values
      });

      // Then, request plugin upload.
      if (strapi.plugins.upload) {
        // Upload new files and attach them to this entity.
        await strapi.plugins.upload.services.upload.uploadToEntity(params, files, source);
      }

      return strapi.query(params.model, source).findOne({
        id: params.id
      });
    }

    // Raw JSON.
    return strapi.query(params.model, source).update({
      id: params.id,
      values
    });
  },

  delete: async (params, { source }) => {
    const response = await strapi.query(params.model, source).findOne({
      id: params.id
    });

    params.values = Object.keys(JSON.parse(JSON.stringify(response))).reduce((acc, current) => {
      const association = (strapi.models[params.model] || strapi.plugins[source].models[params.model]).associations.filter(x => x.alias === current)[0];

      // Remove relationships.
      if (association) {
        acc[current] = _.isArray(response[current]) ? [] : null;
      }

      return acc;
    }, {});

    if (!_.isEmpty(params.values)) {
      // Run update to remove all relationships.
      await strapi.query(params.model, source).update(params);
    }

    // Delete an entry using `queries` system
    return await strapi.query(params.model, source).delete({
      id: params.id
    });
  },

  getModel: (params, {source}) => {
    return (strapi.models[params.model] || strapi.plugins[source].models[params.model]);
  },

};
