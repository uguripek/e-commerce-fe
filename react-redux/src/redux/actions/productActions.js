import * as actionTypes from "./actionTypes";

export function getProductsSuccess(products) {
  return { type: actionTypes.GET_PRODUCTS_SUCCESS, payload: products };
}

export function createProductSuccess(product) {
  return { type: actionTypes.CREATE_PRODUCT_SUCCESS, payload: product };
}

export function updateProductSuccess(product) {
  return { type: actionTypes.UPDATE_PRODUCT_SUCCESS, payload: product };
}

export function saveProductApi(product) {
  product.unitsInStock =Number(product.unitsInStock);
  return fetch("https://localhost:5001/api/Products/" + (product.id || ""), {
    method: product.id ? "PUT" : "POST",
    headers: { "content-type": "application/json","accept": "text/plain" },
    body: JSON.stringify(product)
  })
    .then(response => handleResponse(response.clone()))
    .catch(handleError);
}

export function saveProduct(product) {
  return function(dispatch) {
    return saveProductApi(product)
      .then(savedProduct => {
        product.id
          ? dispatch(updateProductSuccess(savedProduct))
          : dispatch(createProductSuccess(savedProduct));
      })
      .catch(error => {
        throw error;
      });
  };
}

export async function handleResponse(response){
  if(response.ok){
    return  response;
  }

  const error = await response.text()
  throw new Error(error)
}

export function handleError(error){
  console.error("Bir hata oluştu")
  throw error;
}

export function getProducts(categoryId) {
  return function(dispatch) {
    let url = "https://localhost:5001/api/Products";
    if (categoryId) {
      url = url + "?categoryId=" + categoryId;
    }
    return fetch(url)
      .then(response => response.json())
      .then(result => dispatch(getProductsSuccess(result)));
  };
}
