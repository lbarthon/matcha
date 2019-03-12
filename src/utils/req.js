import httpBuildQuery from 'http-build-query';

const req = (url, body) => {
  return new Promise((resolve, reject) => {
    if (body) {
      console.log('post');
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
            if (json.success) {
              resolve(json.success);
            } else if (json.error) {
              reject(json.error);
            }
          })
        } else {
          console.error(new Error(response.statusText));
        }
      });
    } else {
      console.log('get');
      fetch(url, {
        headers: {'CSRF-Token': localStorage.getItem('csrf')}
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log(json);
            if (json.success) {
              resolve(json.success);
            } else if (json.error) {
              reject(json.error);
            }
          })
        } else {
          console.error(new Error(response.statusText));
        }
      });
    }
  });
}

export default req;
