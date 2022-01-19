import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1 and other
    if (currPage === 1 && currPage < numPages)
      return this._generateMarkupNextPage(currPage + 1);

    // last page
    if (currPage === numPages && currPage > 1)
      return this._generateMarkupPrevPage(currPage - 1);

    // page 2 to last page
    if (currPage < numPages)
      return `${this._generateMarkupPrevPage(
        currPage - 1
      )} ${this._generateMarkupNextPage(currPage + 1)}`;

    // only page 1
    return '';
  }
  _generateMarkupPrevPage(page) {
    return `<button data-goto=${page} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page}</span>
            </button>`;
  }
  _generateMarkupNextPage(page) {
    return ` <button data-goto=${page} class="btn--inline pagination__btn--next">
            <span>Page ${page}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }
}

export default new PaginationView();
