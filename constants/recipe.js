const RecipeRoutes = {
  create: "/create",
  createClone: "/create-clone",
  getAllRecipes: "/get-all",
  getUserRecipes: "/get-user-recipes",
  get: "/get",
  getRecipeWithoutCookbook: "/get-recipe-without-cookbook",
  getFilteredRecipes: "/get-filtered-recipes",
  getRecipeStatistics: "/get-recipe-statistics",
  getAllSortedRecipes: "/get-all-sorted-recipes",
  getRecipesForMain: "/get-recipes-for-main",
  updateRecipeComments: "/update-recipe-comments",
  updateRecipeCookbookid: "/update-recipe-cookbookid",
  update: "/update",
  updateLikes: "/update-likes",
  deleteRecipeCookbookid: "/delete-recipe-cookbookid",
  delete: "/delete",
  deleteCommentsId: "/delete-comments-id",
};

module.exports = { RecipeRoutes };
