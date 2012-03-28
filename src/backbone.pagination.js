(function() {
  var results_object_name = 'results',
      pagination_object_name = 'pagination',

      pagination_object_map = {
        page:           'page',
        pages:          'page_count',
        per_page:       'per_page',
        total_results:  'result_count'
      },

      pagination_default_values = {
        page:           1,
        pages:          1,
        per_page:       10,
        total_results:  0;
      };

  Backbone.PaginatedCollection = Backbone.Collection.extend({
    initialize: function() {
      var self = this,
          setDefaultValue = function(value, variable) {
            self[variable] = value;
          };

      _(pagination_default_values).each(setDefaultValue);
    }
  });

  _.extend(Backbone.PaginatedCollection.prototype, {
    parse: function(response, request) {
      this._updatePaginationInfo(response[pagination_object_name]);

      return response[results_object_name];
    },

    _updatePaginationInfo: function(info) {
      var self = this,
          setPaginationVariable = function(response_variable, variable) {
            self[variable] = info[response_variable];
          };

      _(pagination_object_map).each(setPaginationVariable);
    }
  });
}).call(this);