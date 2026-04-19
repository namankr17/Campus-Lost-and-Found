import { useFilter } from "../../contexts/filter/FilterContext";

function LeftSidebar() {
  const { filters, updateFilters } = useFilter();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  const handleQuickFilter = (type) => {
    updateFilters({ itemType: type });
  };

  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <select
          className="sidebar-select"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="pets">Pets</option>
          <option value="electronic">Electronic</option>
          <option value="jewelry">Jewelry</option>
          <option value="accessory">Accessory</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="keys">Keys</option>
          <option value="bags">Bags & Wallets</option>
        </select>
      </div>

      <div className="sidebar-section">
        <h3>Sort By</h3>
        <select
          className="sidebar-select"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
        >
          <option value="recent">Date Posted (Newest)</option>
          <option value="oldest">Date Posted (Oldest)</option>
        </select>
      </div>

      <div className="sidebar-section quick-filters">
        <h3>Quick Filters</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${
              filters.itemType === "all" ? "active" : ""
            }`}
            onClick={() => handleQuickFilter("all")}
          >
            All Items
          </button>
          <button
            className={`filter-btn ${
              filters.itemType === "lost" ? "active" : ""
            }`}
            onClick={() => handleQuickFilter("lost")}
          >
            Lost Items
          </button>
          <button
            className={`filter-btn ${
              filters.itemType === "found" ? "active" : ""
            }`}
            onClick={() => handleQuickFilter("found")}
          >
            Found Items
          </button>
        </div>
      </div>

      <div className="sidebar-section popular-locations">
        <h3>Popular Locations</h3>
        <ul className="location-list">
          <li>📍 NLHC</li>
          <li>📍 Library</li>
          <li>📍 Gym</li>
          <li>📍 Main Canteen</li>
          <li>📍 RD Tea Stall</li>
        </ul>
      </div>

      <div className="sidebar-section tips">
        <h3>Quick Tips</h3>
        <div className="tips-container">
          <div className="tip">
            <span className="tip-title">📸 Add Clear Photos</span>
            <p>Include clear images to help identify items</p>
          </div>
          <div className="tip">
            <span className="tip-title">📝 Detailed Description</span>
            <p>Be specific about item characteristics</p>
          </div>
          <div className="tip">
            <span className="tip-title">🗺️ Precise Location</span>
            <p>Mention exact location where item was lost/found</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
