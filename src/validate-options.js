import Ajv from 'ajv';
import schema from './schema';

function validateOptions(data) {
  const ajv = new Ajv();
  const isValid = ajv.validate(schema, data);

  return {
    isValid,
    error: ajv.errors && ajv.errorsText()
  };
}

export default validateOptions;
