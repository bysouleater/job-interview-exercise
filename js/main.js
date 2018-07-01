/**
 * Show or Hide the edit form of an item and add/remove new item mark
 * @param {element} item 
 * @param {boolean} newClass
 */
function toggleItemForm(item, newClass) {
  item.toggleClass(EDITABLE_CLASS);
  item.toggleClass(NEW_ITEM_CLASS, !!newClass);
}

/**
 * Updates Item HTML
 * @param {element} item
 * @param {int} id
 */
function updateItemHTML(item, id) {
  var fields = ItemList.getItem(id);

  item.data(DATA_ID, fields.id);
  item.find(IMAGE_SELECTOR).attr('src', fields.image);
  item.find(DESCRIPTION_TEXT_SELECTOR).html(fields.description);
  item.find(DESCRIPTION_INPUT_SELECTOR).val(fields.description);

  toggleItemForm(item);
}

/**
 * Removes an item from the list and HTML
 * @param {element} item 
 */
function deleteItem(item) {
  if (confirm('Are you sure you want to remove this item?')) {
    ItemList.removeItem(item.data(DATA_ID));
    item.remove();
    updateListCount();
  }
}

/**
 * Add all button handlers for an item
 * @param {element} item 
 */
function addHandlers(item) {
  // Edit Item Handler: Shows edit form
  item.find(EDIT_BUTTON_SELECTOR).click(function () {
    toggleItemForm(item);
  });

  // Delete Item Handler: Removes item from list and HMTL
  item.find(DELETE_BUTTON_SELECTOR).click(function () {
    deleteItem(item);
  });

  // Save Item Handler: Creates or Updates and item from the list
  item.find(SAVE_BUTTON_SELECTOR).click(function () {
    var id = item.data(DATA_ID);
    var fields = {
      description: item.find(DESCRIPTION_INPUT_SELECTOR).val()
    };
    ItemList.updateItem(id, fields);
    updateItemHTML(item, id);
  });

  // Discard Item Changes Handler: Restores and Item to original state or remove if new
  item.find(DISCARD_BUTTON_SELECTOR).click(function () {
    if (item.hasClass(NEW_ITEM_CLASS)) {
      deleteItem(item);
    } else {
      updateItemHTML(item, item.data(DATA_ID));
    }
  });
}

/**
 * Updates the item list to reflect the order of the HTML items
 * @param {object} event 
 * @param {object} ui 
 */
function updateListOrder(event, ui) {
  var id = $(ui.item).data(DATA_ID);
  var position = $(ui.item).index();
  ItemList.updateItemPosition(id, position);
}

/**
 * Updates the counter to reflect list size
 */
function updateListCount() {
  $(ITEM_COUNT_SELECTOR).html(ItemList.items.length);
}

$(function () {
  var source   = document.getElementById(ITEM_TEMPLATE_SELECTOR).innerHTML;
  var itemTemplate = Handlebars.compile(source);
  var itemListElement = $(ITEM_LIST_SELECTOR);

  // Initialize item list
  ItemList.loadList();
  updateListCount();
  
  // Append all items to HTML
  ItemList.items.forEach(function (item) {
    var itemElement = $(itemTemplate(item));
    addHandlers(itemElement);
    itemListElement.append(itemElement);
  });

  // Initialize Drag & Drop Sorting
  itemListElement.sortable({ update: updateListOrder });
  itemListElement.disableSelection();

  // Initializa Add Handler
  $(ADD_BUTTON_SELECTOR).click(function () {
    var item = ItemList.addItem();
    var itemElement = $(itemTemplate(item));
    addHandlers(itemElement);
    toggleItemForm(itemElement, true);
    itemListElement.prepend(itemElement);
    updateListCount();
  }); 
});