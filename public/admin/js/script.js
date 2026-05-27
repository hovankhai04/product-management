// Button Status 
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href);
  buttonsStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) { // lấy giá trị status ở phần lọc xong đưa lên url để tìm kiếm theo status.
        url.searchParams.set("status", status); // sử dụng hàm new URL ở trên để có thể dùng hàm searchParams.set để thay đổi tham số trong url
      }
      else {
        url.searchParams.delete("status"); // xóa tham số status khỏi url
      }
      window.location.href = url.href; // thay đổi url để tìm kiếm theo tham số status
    });
  });
}
// End Button Status

// Form seach
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    }
    else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  })
}
// End Form seach

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    })
  })
}
// End Pagination

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector(
    "input[name='checkAll']"
  );
  const inputsId = checkboxMulti.querySelectorAll(
    "input[name='id']"
  );

  // Check All
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach(inputId => {
        inputId.checked = true;
      })
    }
    else {
      inputsId.forEach(inputId => {
        inputId.checked = false;
      })
    }
  })

  // Checkbox con
  inputsId.forEach(inputId => {
    inputId.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      }
      else {
        inputCheckAll.checked = false;
      }
    })
  })
}
// End Checkbox Multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;

    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm đã chọn?");

      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach(input => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;
          console.log(position);
          ids.push(`${id}-${position}`);
        }
        else {
          ids.push(id);
        }

      })
      // console.log(ids.join(", "));
      inputIds.value = ids.join(", ");

      formChangeMulti.submit();
    }
    else {

    }
  })
}
// End Form Change Multi

// Show Alert
const showAlert = document.querySelector("[show-alert]");
const closeAlert = document.querySelector("[close-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));


  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  })
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0]; // e.target = uploadImageInput
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
}
// End Upload Image

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;
  });

  // thêm selected cho option
  const sortkey = url.searchParams.get("sortKey");
  const sortvalue = url.searchParams.get("sortValue");

  if (sortkey && sortvalue) {
    const stringSort = `${sortkey}-${sortvalue}`;
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
    optionSelected.selected = true;
  }
}
// End Sort
