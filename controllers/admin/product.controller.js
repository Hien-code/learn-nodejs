//[GET] admin/products
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    delete: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts
  );
  //end pagination
  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)
    .sort({ position: -1 });

  res.render("admin/pages/products/index", {
    pageTitle: "Trang product",
    product: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  // res.redirect("/admin/products");
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[PATCH] admin/products/change-multi"
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      );

      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          delete: true,
          deleteAt: new Date(),
        }
      );
      req.flash("success", `Đã xóa ${ids.length} sản phẩm thành công!`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash(
        "success",
        `Đã đổi vị trí của ${ids.length} sản phẩm thành công!`
      );
      break;
    default:
      break;
  }
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    {
      delete: true,
      deleteAt: new Date(),
    }
  );
  req.flash("success", `Đã xóa sản phẩm thành công!`);

  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[GET] admin/products/create
module.exports.create = (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Trang tạo mới sản phẩm",
  });
};

//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  //Tạo 1 product mới từ form
  const product = new Product(req.body);

  //Lưu product mới vào form
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//[GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      delete: false,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit", {
      pageTitle: "Trang sửa sản phẩm",
      product: product,
    });
  } catch (error) {
    res.render(`${systemConfig.prefixAdmin}/products`);
  }
};

//[PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash("success", `Cập nhật thành công sản phẩm!`);
  } catch (error) {
    req.flash("error", `Cập nhật sản phẩm thất bại!`);
  }

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//[GET] admin/products/trash
module.exports.trash = async (req, res) => {
  const product = await Product.find({ delete: true });
  res.render("admin/pages/products/trash", {
    pageTitle: "Trang xóa vĩnh viễn sản phẩm",
    product: product,
  });
};

//[DELETE] admin/products/delete/hard/:id
module.exports.deleteHard = async (req, res) => {
  const id = req.params.id;
  await Product.deleteOne({ _id: id });
  req.flash("success", `Đã xóa sản phẩm thành công!`);
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[PATCH] admin/products/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { delete: false, deleteAt: new Date() });
  req.flash("success", `Đã khôi phục sản phẩm thành công!`);
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      delete: false,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.render(`${systemConfig.prefixAdmin}/products`);
  }
};
