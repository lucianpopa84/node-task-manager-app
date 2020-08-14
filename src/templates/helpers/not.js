const hbs = require('hbs');

hbs.registerHelper('not', function (value) {
    return !value;
});