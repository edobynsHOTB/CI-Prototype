/**
 * Handlebars Helpers: {{maps}}
 *
 * This just an example helper to get you started on
 * adding custom helpers to your own projects.
 *
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */


// Export helpers
module.exports.register = function (Handlebars, options, params) {
  'use strict';  

  Handlebars.registerHelper('maps', function(api) {
    return new Handlebars.SafeString("<script async defer src='https://maps.googleapis.com/maps/api/js?key=" + api + "&callback=initMap'></script>");
  });
};
