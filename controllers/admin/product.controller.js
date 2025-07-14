//[GET] admin/products
const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  //findIndex : Tìm bản ghi thỏa mãn điều kiện nào đó.
  //Lặp qua từng item của Mảng filterStatus
  //Lấy ra bản ghi == bản ghi người dùng truyển lên
  if (req.query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == req.query.status
    );
    //Cập nhật lại bản ghi trong mảng có status = req.query.status(Người ta truyền lên)
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    //Cập nhật lại bản ghi trong mảng có status = req.query.status(Người ta truyền lên)
    filterStatus[index].class = "active";
  }

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

  const products = await Product.find(find);
  res.render("admin/pages/products/index", {
    pageTitle: "Trang product",
    product: products,
    filterStatus: filterStatus,
    keyword: keyword,
  });
};
