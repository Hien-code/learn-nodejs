//[GET] admin/products
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  console.log(filterStatus);

  let find = {
    delete: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regexKeyword = new RegExp(keyword, "i");
    find.title = regexKeyword;
  }

  //pagination
  let objectPagination = {
    limitItem: 4,
    currentPage: 1,
  };

  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
    objectPagination.skip =
      (objectPagination.currentPage - 1) * objectPagination.limitItem;
  }

  const countProducts = await Product.countDocuments(find);
  const totalPages = Math.ceil(countProducts / objectPagination.limitItem);
  objectPagination.totalPages = totalPages;

  //end pagination

  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
  res.render("admin/pages/products/index", {
    pageTitle: "Trang product",
    product: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination,
  });
};
