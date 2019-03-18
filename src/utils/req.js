import httpBuildQuery from 'http-build-query';

const req = (url, body) => {
  return new Promise((resolve, reject) => {
    if (body) {
      body = httpBuildQuery(body);
      fetch(url, {
        method: 'POST',
        body: body,
        headers: {
          'CSRF-Token': localStorage.getItem('csrf'),
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json.success !== undefined) {
              resolve(json.success);
            } else if (json.error) {
              reject(json.error);
            } else {
              reject("alert.ajax_error");
            }
          }).catch(() => {
            reject("alert.ajax_error")
          })
        } else {
          reject("alert.ajax_error");
        }
      })
      .catch(() => {
        reject("alert.ajax_error")
      });
    } else {
      fetch(url, {
        headers: {'CSRF-Token': localStorage.getItem('csrf')}
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json.success !== undefined) {
              resolve(json.success);
            } else if (json.error) {
              reject(json.error);
            } else {
              reject("alert.ajax_error");
            }
          }).catch(() => {
            reject("alert.ajax_error")
          })
        } else {
          reject("alert.ajax_error");
        }
      }).catch(() => {
        reject("alert.ajax_error")
      });
    }
  });
}

export default req;
