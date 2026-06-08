const page = document.querySelector(".partners-page");
const searchInput = document.querySelector("#partner-search");
const filterPanel = document.querySelector("#filter-panel");
const filterToggle = document.querySelector(".filter-toggle");
const filterClose = document.querySelector(".filter-close");
const filterBackdrop = document.querySelector(".filter-backdrop");
const clearFilters = document.querySelector(".clear-filters");
const checkboxes = Array.from(document.querySelectorAll(".filter-panel input[type='checkbox']"));
const quickCategoryFilterBar = document.querySelector(".quick-category-filters");
const quickCategoryFilters = Array.from(document.querySelectorAll("[data-category-filter]"));
const cards = Array.from(document.querySelectorAll(".partner-result-card"));
const partnerCategories = Array.from(document.querySelectorAll(".partner-category"));
const emptyResults = document.querySelector(".empty-results");

const getSelectedValues = (name) =>
  checkboxes
    .filter((checkbox) => checkbox.name === name && checkbox.checked)
    .map((checkbox) => checkbox.value);

const syncQuickCategoryFilters = (categories) => {
  quickCategoryFilters.forEach((button) => {
    const value = button.dataset.categoryFilter;
    const isActive = value === "all" ? categories.length === 0 : categories.includes(value);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const updateResults = () => {
  const query = searchInput.value.trim().toLowerCase();
  const categories = getSelectedValues("category");
  const areas = getSelectedValues("area");
  const discounts = getSelectedValues("discount");
  let visibleCount = 0;

  syncQuickCategoryFilters(categories);

  cards.forEach((card) => {
    const matchesQuery = !query || card.dataset.search.includes(query);
    const matchesCategory = categories.length === 0 || categories.includes(card.dataset.category);
    const matchesArea = areas.length === 0 || areas.includes(card.dataset.area);
    const matchesDiscount = discounts.length === 0 || discounts.includes(card.dataset.discount);
    const isVisible = matchesQuery && matchesCategory && matchesArea && matchesDiscount;

    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  partnerCategories.forEach((category) => {
    const hasVisibleCard = Boolean(category.querySelector(".partner-result-card:not([hidden])"));
    category.hidden = !hasVisibleCard;
  });

  emptyResults.hidden = visibleCount !== 0;
};

const openFilters = () => {
  page.classList.add("filters-open");
  filterToggle.setAttribute("aria-expanded", "true");
  filterBackdrop.hidden = false;
};

const closeFilters = () => {
  page.classList.remove("filters-open");
  filterToggle.setAttribute("aria-expanded", "false");
  filterBackdrop.hidden = true;
};

searchInput.addEventListener("input", updateResults);
checkboxes.forEach((checkbox) => checkbox.addEventListener("change", updateResults));
if (quickCategoryFilterBar) {
  quickCategoryFilterBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-filter]");
    if (!button) {
      return;
    }

    const value = button.dataset.categoryFilter;
    const categoryCheckboxes = checkboxes.filter((checkbox) => checkbox.name === "category");

    if (value === "all") {
      categoryCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      updateResults();
      return;
    }

    const checkbox = categoryCheckboxes.find((item) => item.value === value);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      updateResults();
    }
  });
}
filterToggle.addEventListener("click", openFilters);
filterClose.addEventListener("click", closeFilters);
filterBackdrop.addEventListener("click", closeFilters);
clearFilters.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  searchInput.value = "";
  updateResults();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFilters();
  }
});

updateResults();
