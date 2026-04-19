import { useFilter } from "../../contexts/filter/FilterContext";

const FilterMenu = () => {
  const { filters, updateFilters } = useFilter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <label>
          Status:
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="all">All</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
          </select>
        </label>
      </div>

      <div className="filter-section">
        <label>
          Type:
          <select
            name="itemType"
            value={filters.itemType}
            onChange={handleChange}
          >
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>
      </div>

      <div className="filter-section">
        <label>
          Sort By:
          <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
            <option value="recent">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default FilterMenu;
