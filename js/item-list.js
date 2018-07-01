var ItemList = {
  
  items: [],

  /**
   * Load item list from localStorage
   */
  loadList: function () {
    var savedItems = window.localStorage.getItem(ITEM_LIST);
    this.items = savedItems ? JSON.parse(savedItems) : [
      {id: 1, image:'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO 9TXL0Y4OHwAAAABJRU5ErkJggg==',description:'lalala'},
      {id: 2, image:'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO 9TXL0Y4OHwAAAABJRU5ErkJggg==',description:'lalala'},
    ];
  },

  /**
   * Save item list in localStorage
   */
  saveList: function () {
    window.localStorage.setItem(ITEM_LIST, JSON.stringify(this.items));
  },

  /**
   * Return next item id using last saved id from localStorage
   */
  nextId: function () {
    var nextId = parseInt(window.localStorage.getItem(LAST_ID) || 0) + 1;
    window.localStorage.setItem(LAST_ID, nextId);

    return nextId;
  },

  /**
   * Updates an item from the list and save it
   * @param {int} id
   * @param {object} fields
   */
  updateItem: function (id, fields) {
    var item = this.getItem(id);
    _.extend(item, fields);
    this.saveList();
  },

  /**
   * Creates a new item in the list and save it
   */
  addItem: function () {
    var newItem = { id: this.nextId(), image: 'images/placeholder.png' };
    this.items.splice(0, 0, newItem);
    this.saveList();
    return newItem;
  },

  /**
   * Remove item from list and save it
   * @param {int} id
   */
  removeItem: function (id) {
    _.remove(this.items, function(item) {
      return item.id === id;
    });
    this.saveList();
  },

  /**
   * Returns an item from the list
   * @param {int} id
   */
  getItem: function (id) {
    return _.find(this.items, function (item) {
      return item.id === id;
    });
  },

  /**
   * Updates item position in the list and save it
   * @param {int} id
   * @param {int} position
   */
  updateItemPosition: function (id, position) {
    var item = _.remove(this.items, function (item) {
      return item.id === id;
    });

    this.items.splice(position, 0, item[0]);
    this.saveList();
  },

};