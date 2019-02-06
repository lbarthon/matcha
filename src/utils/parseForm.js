const parseForm = (form) => {
  return new Promise(resolve => {
    let newForm = [];
    for (let key in form) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(form[key]);
      newForm.push(encodedKey + '=' + encodedValue);
    }
    let result = newForm.join('&')
    resolve(result);
  });
}

module.exports = parseForm;
