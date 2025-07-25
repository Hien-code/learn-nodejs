const express = require("express");
const router = express.Router();

const storageMulter = require("../../helpers/storageMulter");

const multer = require("multer");
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  validate.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);
router.get("/trash", controller.trash);
router.delete("/delete-hard/:id", controller.deleteHard);
router.patch("/restore/:id", controller.restore);

module.exports = router;
