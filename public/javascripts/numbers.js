const parseJSON = (response) => {
  return new Promise((resolve) => response.json()
    .then((json) => resolve({
      status: response.status,
      ok: response.ok,
      ...json,
    })));
}

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(parseJSON)
      .then(res => {
        if (res.status >= 400) {
          return reject(res);
        }

        return resolve(res);
      })
  });
};

class NumbersService {
  // Define buttons and other html elements
  constructor() {
    this.globalLoader = document.getElementById('globalLoader');
    this.submitButton = document.getElementById('submit');
    this.listContainer = document.getElementById('list');
    this.errorsContainer = document.getElementById('errors');
    this.input = document.getElementById('number');
    this.form = document.getElementById('form');

    this.initialize();
  }

  async getData() {
    try {
      this.setLoading();
      const query = window.location.search || '';
      const { data } = await request(`/numbers/data${query}`);
      this.render(data);
    } catch (e) {
      console.log('Error', e);
    } finally {
      this.setLoading(false);
    }
  }

  async saveNumber(number) {
    try {
      this.setInProcess();
      this.printErrors(null);
      const { data } = await request('/numbers', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number }),
      });
      this.input.value = '';
      this.render(data);
    } catch (e) {
      console.log('Error', e);
      this.printErrors(e.errors);
    } finally {
      this.setInProcess(false);
    }
  }

  setLoading(loading = true) {
    if (!loading) {
      this.globalLoader.classList.add('hidden');
      return;
    }

    this.globalLoader.classList.remove('hidden');
  }

  setInProcess(inProcess = true) {
    if (!inProcess) {
      this.submitButton.classList.remove('loading');
      return;
    }

    this.submitButton.classList.add('loading');
  }

  createText(staticText = '', value = '') {
    const element = document.createElement('p');
    element.append(`${staticText} ${value}`);
    return element;
  }

  printErrors(errors = []) {
    if (Array.isArray(errors)) {
      errors.forEach(err => {
        this.errorsContainer.append(this.createText('Ошыбка: ', err.msg))
      });
      return;
    }

    this.errorsContainer.innerHTML = '';
  }

  createElement(data = {}) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('list-item');
    itemElement.append(
      this.createText('Пред.', data.previous),
      this.createText('След.', data.current),
      this.createText('Среднее.', data.average),
    );
    if (data.completed) {
      itemElement.classList.add('completed');
    }
    return itemElement;
  }

  render(data = []) {
    this.listContainer.innerHTML = '';
    data.forEach(i => {
      this.listContainer.appendChild(this.createElement(i));
    })
  }

  initialize() {
    this.getData();
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.saveNumber(this.input.value);
    })
  }
}

window.NumberService = new NumbersService();
