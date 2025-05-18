export default function FilterSidebar({ selectedCity, setSelectedCity }) {
  const cities = ["Delhi", "Bangalore", "Chennai", "Mumbai", "Andhra Pradesh", "Telangana"];

  return (
    <div className="w-64 p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <h3 className="font-medium">City</h3>
      <ul>
        {cities.map(city => (
          <li key={city} className="my-2">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="city"
                checked={selectedCity === city}
                onChange={() => setSelectedCity(city)}
              />
              <span className="ml-2">{city}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
