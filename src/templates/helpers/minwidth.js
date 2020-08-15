const hbs = require('hbs');

hbs.registerHelper('minwidth', function (value) {
    return Math.max(24, Math.min(value, 32));
});