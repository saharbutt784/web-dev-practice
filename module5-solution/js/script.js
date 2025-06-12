(function (global) {
  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = 
    "https://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = 
    "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title-snippet.html";
  var menuItemHtml = "snippets/menu-item-snippet.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}' 
  // with propValue in given 'string' 
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHome").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHome").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navMenu").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenu").className = classes;
    }
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    // Initialize randomCategoryShortName with default value
    dc.randomCategoryShortName = "SP";
    
    // Load the home page first
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content")
          .innerHTML = responseText;
      },
      false);
  });

  // Load the menu categories view
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      function (response) {
        // Select a random category from the response
        var categories = response;
        var randomIndex = Math.floor(Math.random() * categories.length);
        dc.randomCategoryShortName = categories[randomIndex].short_name;
        
        buildAndShowCategoriesHTML(categories);
      },
      true);
  };

  // Load the menu items view
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort,
      buildAndShowMenuItemsHTML);
  };

  // Builds HTML for the categories page based on the data
  // from the server
  function buildAndShowCategoriesHTML(categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            // Switch CSS class active to menu button
            switchMenuToActive();
            
            var categoriesViewHtml = 
              buildCategoriesViewHtml(categories, 
                                    categoriesTitleHtml,
                                    categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
          },
          false);
      },
      false);
  }

  // Using categories data and snippets html
  // build categories view HTML to be inserted into page
  function buildCategoriesViewHtml(categories, 
                                 categoriesTitleHtml,
                                 categoryHtml) {
    
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the single category page based on the data
  // from the server
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    // Load title snippet of menu items page
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        // Retrieve single menu item snippet
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            // Switch CSS class active to menu button
            switchMenuToActive();
            
            var menuItemsViewHtml = 
              buildMenuItemsViewHtml(categoryMenuItems, 
                                    menuItemsTitleHtml,
                                    menuItemHtml);
            insertHtml("#main-content", menuItemsViewHtml);
          },
          false);
      },
      false);
  }

  // Using category and menu items data and snippets html
  // build menu items view HTML to be inserted into page
  function buildMenuItemsViewHtml(categoryMenuItems, 
                                 menuItemsTitleHtml,
                                 menuItemHtml) {
    
    menuItemsTitleHtml = 
      insertProperty(menuItemsTitleHtml, 
                    "name", 
                    categoryMenuItems.category.name);
    menuItemsTitleHtml = 
      insertProperty(menuItemsTitleHtml, 
                    "special_instructions", 
                    categoryMenuItems.category.special_instructions);

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over menu items
    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    for (var i = 0; i < menuItems.length; i++) {
      // Insert menu item values
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  global.$dc = dc;

})(window);