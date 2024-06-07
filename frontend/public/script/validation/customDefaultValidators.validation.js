// Default validator for empty values, defined to simplify code readability
const defaultPresenceValidator = { presence: { allowEmpty: false, message: "^This field is required." } };
const defaultMaxLength = { length: { maximum: 191, tooLong: '^Too long (maximum length is %{count} characters).' } }