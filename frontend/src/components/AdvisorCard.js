export default function AdvisorCard({ advisor }) {
  return (
    <div className="flex items-center justify-between border p-4 rounded mb-4 shadow">
      <div className="flex items-center gap-4">
        <img src={advisor.image} alt={advisor.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h3 className="font-bold text-lg">{advisor.name}</h3>
          <p>Experience: {advisor.experience} Yrs | Rating: ⭐ {advisor.rating}</p>
          <p>{advisor.city}</p>
          <span className="text-sm bg-gray-200 px-2 py-1 rounded">{advisor.expertise}</span>
        </div>
      </div>
      <button className="bg-red-500 text-white px-4 py-2 rounded">Book Home Visit</button>
    </div>
  );
}
