// Reusable Modal Component
class Modal {
  constructor(id, title = 'Modal', content = '', primaryButtonText = 'OK', onPrimaryClick = () => {},
              secondaryButtonText = 'Cancel', onSecondaryClick = () => {},
              showSecondary = true) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.primaryButtonText = primaryButtonText;
    this.onPrimaryClick = onPrimaryClick;
    this.secondaryButtonText = secondaryButtonText;
    this.onSecondaryClick = onSecondaryClick;
    this.showSecondary = showSecondary;
    this.modalElement = null;
    this.render();
  }

  render() {
    this.modalElement = document.createElement('div');
    this.modalElement.id = this.id;
    this.modalElement.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 hidden';
    this.modalElement.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
        <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 class="text-xl font-bold">${this.title}</h3>
          <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 close-modal-btn">✖</button>
        </div>
        <div class="p-4 text-gray-700 dark:text-gray-300">
          ${this.content}
        </div>
        <div class="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
          ${this.showSecondary ? `<button class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition secondary-modal-btn">${this.secondaryButtonText}</button>` : ''}
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition primary-modal-btn">${this.primaryButtonText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.modalElement);

    this.modalElement.querySelector('.close-modal-btn').addEventListener('click', () => this.hide());
    this.modalElement.querySelector('.primary-modal-btn').addEventListener('click', () => this.onPrimaryClick(this));
    if (this.showSecondary) {
      this.modalElement.querySelector('.secondary-modal-btn').addEventListener('click', () => this.onSecondaryClick(this));
    }
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) this.hide();
    });
  }

  show() {
    this.modalElement.classList.remove('hidden');
  }

  hide() {
    this.modalElement.classList.add('hidden');
  }
}

if (typeof window !== 'undefined') {
  window.Modal = Modal;
}
