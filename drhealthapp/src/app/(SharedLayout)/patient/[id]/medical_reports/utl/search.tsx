export default function FileSearch() {
    return (
      <div className="w-72 flex items-center border border-gray-300 bg-white rounded-[8px] px-4 py-2 space-x-2">
        <img src="/Icons/search.png" alt="search icon" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 outline-none"
        />
      </div>
    );
  }