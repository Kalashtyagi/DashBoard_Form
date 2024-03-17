const queryParams = new URLSearchParams(window.location.search);
 export const mId = queryParams.get('merchantId');
 export const fId = queryParams.get('formId');

console.log("mid",mId, fId); 