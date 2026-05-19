module.exports = (objectPagination, query, countProducts) => {

  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPage = Math.ceil(countProducts / objectPagination.limitItems); // hàm ceil để trả về số nguyên lớn hơn số thập phân trước đó
  objectPagination.totalPage = totalPage;

  return objectPagination;
}