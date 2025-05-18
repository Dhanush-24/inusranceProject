export default function HeaderBanner() {
  return (
    <div className="bg-green-100 p-6 rounded my-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">Get the Best Insurance Advisor at Home</h2>
        <ul className="text-sm mt-2">
          <li>✅ ID Certified Experts</li>
          <li>✅ Free Meeting</li>
          <li>✅ Lifetime Claim Support</li>
        </ul>
      </div>
      <button className="bg-pink-500 text-white px-6 py-2 rounded">Book Home Visit</button>
    </div>
  );
}
