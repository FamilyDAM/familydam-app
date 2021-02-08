//@see https://medium.com/swlh/internationalization-with-react-i18next-360a452e8809
module.exports = {
    createOldCatalogs: false,
    // Save the \_old files

    indentation: 4,
    // Indentation of the catalog files

    keepRemoved: false,
    // Keep keys from the catalog that are no longer in code

    // see below for more details
    lexers: {
        js: ['JsxLexer'], // if you're writing jsx inside .js files, change this to JsxLexer
        default: ['JsxLexer'],
    },

    // lineEnding: 'auto',
    // Control the line ending. See options at https://github.com/ryanve/eol

    locales: ['en-US', 'en-GB', 'zh-CN'],
    // An array of the locales in your applications

    output: 'src/i18n/locales/$LOCALE/$NAMESPACE.json',
    // Supports $LOCALE and $NAMESPACE injection
    // Supports JSON (.json) and YAML (.yml) file formats
    // Where to write the locale files relative to process.cwd()

    input: ['src/**/*.js'],
    // An array of globs that describe where to look for source files
    // relative to the location of the configuration file

    sort: true,
    // Whether or not to sort the catalog

    // useKeysAsDefaultValue: false,
    // Whether to use the keys as the default value; ex. "Hello": "Hello", "World": "World"
    // The option `defaultValue` will not work if this is set to true

    verbose: true,
    // Display info about the parsing including some stats
};