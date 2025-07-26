const buttonRestore = document.querySelectorAll("[button-restore]");
if (buttonRestore.length > 0) {
  const formRestore = document.querySelector("#form-restore");
  const path = formRestore.getAttribute("data-path");

  buttonRestore.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có muốn khôi phục lại sản phẩm này?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=PATCH`;
        formRestore.action = action;
        formRestore.submit();
      }
    });
  });
}

const buttonDeleteHard = document.querySelectorAll("[button-delete-hard]");
if (buttonDeleteHard.length > 0) {
  const formDeleteHard = document.querySelector("#form-delete-hard");
  const path = formDeleteHard.getAttribute("data-path");

  buttonDeleteHard.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có muốn xóa vĩnh viễn sản phẩm này?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteHard.action = action;
        formDeleteHard.submit();
      }
    });
  });
}
