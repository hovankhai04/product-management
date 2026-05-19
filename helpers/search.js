// tìm kiếm theo từ khoá
module.exports = (query) => {
  let objectSearch = {
    keyword: ""
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i"); // tạo regex để tìm kiếm theo từ khoá, "i" để tìm kiếm không phân biệt chữ hoa, chữ thường
    objectSearch.regex = regex;
  }

  return objectSearch;
}