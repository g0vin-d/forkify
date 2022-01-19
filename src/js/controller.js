import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0) render selected result and bookmark
    resultView.update(model.getSeachResultPage());
    bookmarkView.update(model.state.bookmarks);

    //  1) fetch data
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    //2) render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSeachResults = async function () {
  try {
    //1. Get Query
    const query = searchView.getQuery();
    if (!query) return;

    //2. fetch query Results
    resultView.renderSpinner();
    await model.loadSearchResults(query);

    //3. load Results
    // console.log();
    // resultView.render(model.state.search.results);
    resultView.render(model.getSeachResultPage());

    //4. render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultView.renderError();
  }
};

const paginationControl = function (goToPage) {
  //1. load New Search results
  resultView.render(model.getSeachResultPage(goToPage));

  //2. render new pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update servings
  model.updateServings(newServings);

  // render view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlToggleBookmarks = function () {
  // add to recipe to bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update bookmark
  recipeView.update(model.state.recipe);

  // load bookmark View
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    //upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Render bookmark
    bookmarkView.render(model.state.bookmarks);
    bookmarkView.update(model.state.bookmarks);

    // close form model
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlToggleBookmarks);
  searchView.addHandlerSeach(controlSeachResults);
  paginationView.addHandlerClick(paginationControl);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
