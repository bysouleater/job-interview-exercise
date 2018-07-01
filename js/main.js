/**
 * Show or Hide the edit form of an item and add/remove new item mark
 * @param {element} item 
 * @param {boolean} newClass
 */
function toggleItemForm(item, newClass) {
  item.toggleClass(EDITABLE_CLASS);
  item.toggleClass(NEW_ITEM_CLASS, !!newClass);
  
  // Timeout 0 segs to wait for input to appear and correctly focus
  setTimeout(function(){
    item.find(DESCRIPTION_INPUT_SELECTOR).focus();
  });
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
  item.find(IMAGE_UPLOADER_IMG_SELECTOR).attr('src', fields.image);
  item.find(DESCRIPTION_TEXT_SELECTOR).html(fields.description);
  item.find(DESCRIPTION_INPUT_SELECTOR).val(fields.description);
  item.find(DESCRIPTION_CHARS_SELECTOR).html(MAX_DESCRIPTION_LENGTH - fields.description.length);

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
 * Validates selected image and and set as preview
 * @param {element} item 
 * @param {element} uploader 
 */
function handleImageUpload(item, uploader) {
  var file = $(uploader)[0].files[0];
  var img = new Image();

  // Load image in memory
  img.src = _URL.createObjectURL(file);
  
  // Validates Image size when it loads
  img.onload = function() {
    if (this.width <= IMAGE_MAX_WIDTH && this.height <= IMAGE_MAX_HEIGHT) {
      // Encode Image in base64 to be able to save it on storage
      var reader = new FileReader();
      reader.onload = function (e) {
        // Set base64 value in image src to preview the uploaded image
        item.find(IMAGE_UPLOADER_IMG_SELECTOR).attr('src', e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Image size must be <= ' + IMAGE_MAX_WIDTH + 'px X ' + IMAGE_MAX_HEIGHT + 'px');
    }
  };

  img.onerror = function() {
    alert('File selected is not valid');
  };

  // Reset input file to prevent change from triggering when same image uploaded
  item.find(IMAGE_UPLOADER_INPUT_SELECTOR).val('');
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
      description: item.find(DESCRIPTION_INPUT_SELECTOR).val(),
      image: item.find(IMAGE_UPLOADER_IMG_SELECTOR).attr('src'),
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

  // Remaining Chars Handler: Updates remaining chars count
  item.find(DESCRIPTION_INPUT_SELECTOR).bind('input propertychange', function () {
    item.find(DESCRIPTION_CHARS_SELECTOR).html(MAX_DESCRIPTION_LENGTH - this.value.length);
  });

  // Image Upload Handler: Validates selected image and set as preview
  item.find(IMAGE_UPLOADER_INPUT_SELECTOR).change(function () {
    handleImageUpload(item, this);
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
  $(EMPTY_LIST_SELECTOR).toggle(!ItemList.items.length);
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
  $(ADD_BUTTON_SELECTOR).click(function (e) {
    e.preventDefault();
    var item = ItemList.addItem();
    var itemElement = $(itemTemplate(item));
    addHandlers(itemElement);
    toggleItemForm(itemElement, true);
    itemListElement.prepend(itemElement);
    updateListCount();
  }); 
});