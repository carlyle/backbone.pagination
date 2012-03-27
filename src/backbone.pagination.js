Backbone.PaginatedCollection = Backbone.Collection.extend({
  initialize: function() {
    this.page = 1;
    this.pages = 1;
    this.per_page = 10; // 10 is the default number of results per page
    this.total_results = 0;
  }
});

_.extend(Backbone.PaginatedCollection.prototype, {
  parse: function(response, request) {
    this._updatePaginationInfo(response['pagination']);

    return response['results'];
  },

  _updatePaginationInfo: function(info) {
    this.page = info['page'];
    this.pages = info['page_count'];
    this.per_page = info['per_page'];
    this.total_results = info['result_count'];
  }
});