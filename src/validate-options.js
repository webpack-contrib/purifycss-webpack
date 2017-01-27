import Ajv from 'ajv';

function validateOptions(schema, data) {
  const ajv = new Ajv({
    useDefaults: true // This mutates the original data with defaults!
  });
  const isValid = ajv.validate(schema, data);

  return {
    isValid,
    error: ajv.errors && ajv.errorsText()
  };
}

export default validateOptions;
