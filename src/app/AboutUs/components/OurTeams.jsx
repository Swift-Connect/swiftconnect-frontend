export default function OurTeam() {
  return (
    <div className="px-4 md:px-6 py-12 md:py-16">
      <div className="bg-[#FAFAFA] rounded-2xl flex flex-col justify-cente items-cente p-16">
        <div className="bg-blue-600">
          <h1 className="font-bold text-xl">Our Teams</h1>
          <p>Meet the people</p>
          <p>Behind the Platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 bg-red-500 place-items-">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div>
              <div className="w-[18em] h-[18em] bg-black rounded-xl"></div>
              <div>
                <h1>Savannah Nguyen</h1>
                <p>Web Deigner</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
