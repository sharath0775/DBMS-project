// Products Page Logic
class ProductsPage {
  constructor() {
    this.currentPage = 1;
    this.limit = 20;
    this.filters = {};
    this.init();
  }

  async init() {
    // Apply theme
    const theme = StorageManager.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Load categories for filter
    this.loadCategoryFilter();

    // Attach event listeners
    this.attachListeners();

    // Load initial products
    this.loadProducts();
  }

  async loadCategoryFilter() {
    try {
      const categories = await api.getCategories();
      const select = document.getElementById('category-filter');
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }

  attachListeners() {
    document.getElementById('apply-filters').addEventListener('click', () => {
      this.currentPage = 1;
      this.collectFilters();
      this.loadProducts();
    });

    document.getElementById('sort-select').addEventListener('change', () => {
      this.currentPage = 1;
      this.collectFilters();
      this.loadProducts();
    });
  }

  collectFilters() {
    this.filters = {
      page: this.currentPage,
      limit: this.limit,
      category_id: document.getElementById('category-filter').value || null,
      minPrice: document.getElementById('min-price').value || null,
      maxPrice: document.getElementById('max-price').value || null,
      rating: document.getElementById('rating-filter').value || null,
      sort: document.getElementById('sort-select').value || 'newest'
    };
  }

  async loadProducts() {
    try {
      const loading = document.getElementById('loading');
      loading.style.display = 'block';

      this.collectFilters();
      const result = await api.getProducts(this.filters);

      document.getElementById('loading').style.display = 'none';
      const container = document.getElementById('products-container');

      if (result.products && result.products.length > 0) {
        container.innerHTML = result.products.map(p => ProductCard.render(p)).join('');
        this.renderPagination(result);
      } else {
        container.innerHTML = '<p class="col-span-3 text-center text-gray-600 py-8">No products found</p>';
        document.getElementById('pagination').innerHTML = '';
      }
    } catch (err) {
      console.error('Error loading products:', err);
      document.getElementById('loading').style.display = 'none';
      Helpers.showToast('Error loading products', 'error');
    }
  }

  renderPagination(result) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= result.totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = `px-4 py-2 rounded-lg transition ${
        i === result.page 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`;
      btn.addEventListener('click', () => {
        this.currentPage = i;
        this.loadProducts();
        window.scrollTo(0, 0);
      });
      pagination.appendChild(btn);
    }
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProductsPage());
} else {
  new ProductsPage();
}
