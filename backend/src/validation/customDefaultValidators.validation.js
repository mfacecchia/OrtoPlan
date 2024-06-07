// Default validator for empty values, defined to simplify code readability
export const defaultPresenceValidator = { presence: { allowEmpty: false, message: "^This field is required." } };
export const defaultPrismaMaxLength = { length: { maximum: 191, tooLong: '^Too long (maximum length is %{count} characters).' } }