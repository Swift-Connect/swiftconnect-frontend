export default function OurTeam() {
  return (
    <div className="px-4 md:px-6 py-12 md:py-16">
      <div className="bg-[#FAFAFA] rounded-2xl flex flex-col items-center p-6 md:p-16">
        <div className="  w-full mb-8 text-center rounded-xl py-4">
          <h1 className="font-bold text-xl">Our Teams</h1>
          <p>Meet the people</p>
          <p>Behind the Platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center w-full">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex flex-col items-start w-[18em]">
              <div className="w-full h-[18em] bg-black rounded-xl mb-4"></div>
              <div className="w-full text-left">
                <h1 className="font-semibold">Savannah Nguyen</h1>
                <p className="text-gray-500">Web Designer</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
