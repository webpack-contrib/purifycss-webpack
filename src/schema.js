export default {
  $schema: 'http://json-schema.org/draft-04/schema#',
  additionalProperties: false,
  type: 'object',
  properties: {
    styleExtensions: {
      type: 'array',
      items: {
        type: 'string'
      },
      default: ['.css']
    },
    moduleExtensions: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    paths: {
      type: ['array', 'object'],
      items: {
        type: 'string'
      }
    },
    purifyOptions: {
      type: 'object',
      properties: {}
    },
    verbose: {
      type: 'boolean'
    }
  },
  required: [
    'paths'
  ]
};
