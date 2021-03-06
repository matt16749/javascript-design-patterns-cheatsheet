// Observer Pattern is also known as PubSub(Publisher/Subscribe Pattern.)
//   - Allows an object(subscriber) to watch a seperate object(publisher), forming a listen and broadcast relationship.
//   - Mainly used as MV (model-view). Checkout JS framework Backbone.js which primarily uses MV.
//     * Model acts as the publisher. 
//     * View acts as the subscriber.
//   - Advantage of Observer is seperation of concerns. 
//     * Model is changeable and View needs to change what is outputted depdendent on the Model.

//Models (Book Object and BookCollection Object )
function Book(name, isbn) {
    this.name = name;
    this.isbn = isbn;
}

function BookCollection(books) {
    this.books = books;
}

BookCollection.prototype.addBook = function (book) {
    // add book to books array.
    this.books.push(book);
    // Model publishes the parameter book on channel 'book-added'. Checkout line 56.
    $.publish('book-added', book);
    return book;
}

BookCollection.prototype.removeBook = function (book) {
   var removed;
   if (typeof book === 'number') {
       removed = this.books.splice(book, 1);
   }
   for (var i = 0; i < this.books.length; i += 1) {
      if (this.books[i] === book) {
          removed = this.books.splice(i, 1);
      }
   }
   $.publish('book-removed', removed);
   return removed;
}

//View
var BookListView = (function () {
   function removeBook(book) {
      $('#' + book.isbn).remove();
   }

   function addBook(book) {
      $('#bookList').append('<div id="' + book.isbn + '">' + book.name + '</div>');
   }

   return {
      init: function () {
         $.subscribe('book-removed', function (book) {
             removeBook(book);
         });
         // View will have a listener on channel 'book-added' to remove and update the corresponding view based upon the actuall books parameter array
         $.subscribe('book-added', function (book) {
             addBook(book);
         });
      }
   }
}());

