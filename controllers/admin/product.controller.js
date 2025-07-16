//[GET] admin/products
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    delete: false,
  };

  //filerStatus
  if (req.query.status) {
    find.status = req.query.status;
  }

  //search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //pagination
  const countProducts = await Product.countDocuments(find);

  const objectPagination = paginationHelper(
    {
      limitItem: 4,
      currentPage: 1,
    },
    req.query,
    countProducts
  );

  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
  res.render("admin/pages/products/index", {
    pageTitle: "Trang product",
    product: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
