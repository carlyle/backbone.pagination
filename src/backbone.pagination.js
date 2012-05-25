(function() {
  var results_object_name     = 'results',
      pagination_object_name  = 'pagination',
      page_parameter          = 'page',

      pagination_object_map = {
        page          : 'page',
        pages         : 'page_count',
        per_page      : 'per_page',
        total_results : 'result_count'
      },

      pagination_default_values = {
        page          : 1,
        pages         : 1,
        per_page      : 10,
        total_results : 0
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
    isComplete: function() {
      return (this.length === this.total_results);
    },

    parse: function(response, request) {
      this._updatePaginationInfo(response[pagination_object_name]);

      return response[results_object_name];
    },

    onPage: function(page_number) {
      if (page_number < 1)          throw 'Cannot show a page less than 1';
      if (this.page < page_number)  throw 'Cannot show a page that hasn\'t been fetched yet';
      if (this.pages < page_number) throw 'Cannot show a page greater than the total number of (' + this.pages + ')';

      var begin = (page_number - 1) * this.per_page,
          end   = begin + this.per_page;

      return this.models.slice(begin, end);
    },

    fetchNextPage: function(options) {
      options = options || {};
      options.add = true;

      return this._fetchPage(this.page + 1, options);
    },

    _fetchPage: function(page_number, options) {
      if (page_number < 1)          throw 'Cannot fetch a page less than 1';
      if (this.pages < page_number) throw 'Cannot fetch a page greater than the total number of pages (' + this.pages + ')';

      options = options || {};
      options.data = options.data || {};
      options.data[page_parameter] = page_number;

      return this.fetch(options);
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