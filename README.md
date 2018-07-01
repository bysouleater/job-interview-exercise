# Job Interview Exercise
This is a requested exercise for a job interview.

## Exercise Requirements
1. The user should be able to sort the items on the list using a drag and drop functionality.

2. There should be a counter in the page that shows how many items are being displayed.

3. Each item should have the actions: edit and delete. Edit allows a user to update the image of an item and the description text. Delete allows a user to remove an item from the list and update the counter.

4. A functionality to add a new item should exist. This functionality consist on a form to upload an image (jpg, gif and png extensions of 320px x 320px size) and a description text (max chars 300).

5. All the actions of the application should be done without refreshing the page (sort, add, edit and delete) and saved immediately.

6. On a page refresh action, it should be displayed the last state of the list.

7. Tools to be used for the development: vanilla JavaScript with jQuery (or any other js library) with any plugin and html5, css3, sass or less, any type of DB (if needed), any type of backend/language (if needed).

8. You CANNOT use a JavaScript Framework like: angularjs, react, riot, vue.js, etc.


# Implementation

The website () runs entirely on client side and uses Local Storage to retrieve and save the item list. Images are base64 encoded so they can be stored too. No backend code needed.

## Dependencies

- Bootstrap - https://getbootstrap.com/
- jQuery - https://jquery.com/
- jQuery UI (Sortable) - https://jqueryui.com/sortable/
- Handlerbars - https://handlebarsjs.com/
- Lodash - https://lodash.com/