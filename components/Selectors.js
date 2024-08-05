const Selectors = () => (
  <div className="selectors">
    <label htmlFor="chart-type">Chart Type:</label>
    <select id="chart-type" name="chart-type">
      <option value="bar">Bar Chart</option>
      <option value="line">Line Chart</option>
      <option value="scatter">Scatter Plot</option>
      {/* Add more options as needed */}
    </select>
    {/* Add more selectors as needed */}
  </div>
);

export default Selectors;
