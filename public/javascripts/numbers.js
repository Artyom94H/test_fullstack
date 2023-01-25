class NumbersService {
  // Define buttons and other html elements
  constructor() {
    this.globalLoader = document.getElementById('globalLoader');
    this.submitButton = document.getElementById('submit');
    this.listContainer = document.getElementById('list');
    this.input = document.getElementById('number');
    this.form = document.getElementById('form');

    this.initialize();
  }

  async getData() {
    try {
      this.setLoading();
      const query = window.location.search || '';
      const { data } = await (await fetch(`/numbers/data${query}`)).json();
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
      const { data } = await (await fetch('/numbers', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number }),
      })).json();
      this.input.value = '';
      this.render(data);
    } catch (e) {
      console.log('Error', e);
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
