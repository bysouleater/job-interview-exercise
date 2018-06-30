/**
 * Show or Hide the edit form of an item
 * @param {element} item 
 */
function toggleItemForm(item) {
  item.toggleClass('editable');
}

/**
 * Updates Item HTML
 * @param {element} item
 * @param {int} id
 */
function updateItemHTML(item, id) {
  var fields = ItemList.getItem(id);

  item.data('id', fields.id);
  item.find('.image').attr('src', fields.image);
  item.find('.description').html(fields.description);
  item.find('.edit-description').val(fields.description);

  toggleItemForm(item);
}

/**
 * Add all button handlers for an item
 * @param {element} item 
 */
function addHandlers(item) {
  // Edit Item Handler: Shows edit form
  item.find('.edit').click(function () {
    toggleItemForm(item);
  });

  // Delete Item Handler: Removes item from list and HMTL
  item.find('.delete').click(function () {
    ItemList.removeItem(item.data('id'));
    item.remove();
  });

  // Save Item Handler: Creates or Updates and item from the list
  item.find('.save').click(function () {
    var id = item.data('id');
    var fields = {
      description: item.find('.edit-description').val()
    };
    if (id) {
      ItemList.updateItem(id, fields);
    } else {
      id = ItemList.addItem(fields);
    }
    updateItemHTML(item, id);
  });

  // Discard Item Changes Handler: Restores and Item to original state
  item.find('.discard').click(function () {
    var id = item.data('id');
    updateItemHTML(item, id);
  });
}

/**
 * Updates the item list to reflect the order of the HTML items
 * @param {object} event 
 * @param {object} ui 
 */
function updateListOrder(event, ui) {
  var id = $(ui.item).data('id');
  var position = $(ui.item).index();
  ItemList.updateItemPosition(id, position);
}

$(function () {
  var source   = document.getElementById("item-template").innerHTML;
  var itemTemplate = Handlebars.compile(source);
  var itemListElement = $('#item-list');

  // Initialize item list
  ItemList.loadList();
  
  // Append all items to HTML
  ItemList.items.forEach(function (item) {
    var itemElement = $(itemTemplate(item));
    addHandlers(itemElement);
    itemListElement.append(itemElement);
  });

  // Initialize Drag & Drop Sorting
  itemListElement.sortable({ update: updateListOrder });
  itemListElement.disableSelection();
});