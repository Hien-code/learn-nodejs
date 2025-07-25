//Button-Status
//Lấy ra các thuộc tính tự định nghĩa
const buttonsStatus = document.querySelectorAll("[button-status]");

//Nếu có click
if (buttonsStatus.length > 0) {
  //Tạo ra đối tượng URL đại diện cho URL hiện tại của trang web.
  let url = new URL(window.location.href);

  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      //Lấy giá trị của thuộc tính button-status từ phần tử button
      const status = button.getAttribute("button-status");

      if (status) {
        //Thêm hoặc cập nhật tham số status trong URL.
        url.searchParams.set("status", status);
      } else {
        //Xoá tham số status khỏi URL hiện tại.
        url.searchParams.delete("status");
      }
      //Cập nhật lại đường dẫn
      window.location.href = url.href;
    });
  });
}
//End Button-Status

//Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    //Không cần load lại trang
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      //Thêm hoặc cập nhật tham số status trong URL.
      url.searchParams.set("keyword", keyword);
    } else {
      //Xoá tham số status khỏi URL hiện tại.
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
//End Form Search

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  const url = new URL(window.location.href);
  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
      window.location.href = url.href;
    });
  });
}
//End Pagination

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countCheck = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countCheck == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
//End Checkbox Multi

//Form change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    // Type change
    const typeChange = e.target.elements.type.value;

    //Delete
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những này ?");
      if (!isConfirm) {
        return;
      }
    }

    if (inputChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputChecked.forEach((input) => {
        const id = input.value;

        //Change stt
        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");

      formChangeMulti.submit();
    } else {
      alert("Vui lòng check một bản ghi");
    }
  });
}
//End form change Multi

//Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
//End show Alert

//Preview iamge
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
//End Preview iamge
