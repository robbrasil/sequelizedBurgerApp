$(document).ready(function() {
  // Getting a reference to the input field where user adds a new burger
  var newItemInput = $("input.new-item");
  // Our new burgers will go inside the todoContainer
  var todoContainer = $(".burger-container");
  // Adding event listeners for deleting, editing, and adding burgers
  $(document).on("click", "button.delete", deleteBurger);
  $(document).on("click", "button.devoured", toggleDevoured);
  $(document).on("submit", "#burger-form", insertBurger);

  // Our initial burgers array
  var burgers;

  // Getting burgers from database when page loads
  getBurgers();

  // This function resets the burgers displayed with new burgers from the database
  function initializeRows() {
    todoContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < burgers.length; i++) {
      rowsToAdd.push(createNewRow(burgers[i]));
    }
    todoContainer.prepend(rowsToAdd);
  }

  // This function grabs burgers from the database and updates the view
  function getBurgers() {
    $.get("/api/burgers", function(data) {
      console.log("Burgers", data);
      burgers = data;
      initializeRows();
    });
  }

  // This function deletes a burger when the user clicks the delete button
  function deleteBurger() {
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/burgers/" + id
    })
    .done(function() {
      getBurgers();
    });
  }

  // This function sets a burgers devoured attribute to the opposite of what it is
  // and then runs the updateBurger function
  function toggleDevoured() {
    var burger = $(this)
      .parent()
      .data("burger");

    burger.devoured = true;
    updateBurger(burger);
    console.log(burger);
  }

  // This function updates a burger in our database
  function updateBurger(burger) {
    $.ajax({
      method: "PUT",
      url: "/api/burgers",
      data: burger
    })
    .done(function() {
      getBurgers();
    });
  }



  // This function constructs a burger-item row
  function createNewRow(burger) {
    var newInputRow = $("<li>");
    newInputRow.addClass("list-group-item burger-item");
    var newBurgerSpan = $("<span>");
    newBurgerSpan.text(burger.burger_name+ "   ");
    newInputRow.append(newBurgerSpan);
    var newBurgerInput = $("<input>");
    newBurgerInput.attr("type", "text");
    newBurgerInput.addClass("edit");
    newBurgerInput.css("display", "none");
    newInputRow.append(newBurgerInput);
    var newDeleteBtn = $("<button>");
    newDeleteBtn.addClass("delete btn btn-default");
    newDeleteBtn.text("Delete Burger");
    newDeleteBtn.data("id", burger.id);
    var newDevouredBtn = $("<button>");
    newDevouredBtn.addClass("devoured btn btn-default");
    newDevouredBtn.text("Devour Burger!");
    newDevouredBtn.data("id",burger.id);
    newInputRow.append(newDeleteBtn);
    newInputRow.append(newDevouredBtn);
    newInputRow.data("burger", burger);
    
    if (burger.devoured) {
      newBurgerSpan.css("position", "relative");
       newBurgerSpan.css("left", "-150px");
    }
    return newInputRow;
  }

  // This function inserts a new burger into our database and then updates the view
  function insertBurger(event) {
    event.preventDefault();
    // if (!newItemInput.val().trim()) {   return; }
    var burger = {
      burger_name: newItemInput
        .val()
        .trim(),
      devoured: false
    };

    // Posting the new burger, calling getBurgers when done
    $.post("/api/burgers", burger, function() {
      getBurgers();
    });
    newItemInput.val("");
  }

});
