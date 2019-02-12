const parseForm = (form, callback) => {
  let newForm = [];
  for (let key in form) {
    let encodedKey = encodeURIComponent(key);
    let encodedValue = encodeURIComponent(form[key]);
    newForm.push(encodedKey + '=' + encodedValue);
  }
  let result = newForm.join('&')
  callback(result);
}

module.exports = parseForm;
