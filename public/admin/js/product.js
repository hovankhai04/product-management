// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const pathCurrent = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const statusChange = statusCurrent == "active" ? "inactive" : "active";
      const action = pathCurrent + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    })
  })
}
// End Change Status

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  buttonsDelete.forEach(button => {
    button.addEventListener("click", () => {
      const formDelete = document.querySelector("#form-delete-item");
      const path = formDelete.getAttribute("data-path");

      const isConfirm = confirm("Bạn có chắc muốn xóa?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = path + `/${id}?_method=DELETE`;

        formDelete.action = action;
        formDelete.submit();
      }
    })
  })
}
// End Delete Item
