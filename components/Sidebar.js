import Selectors from "./Selectors";

const Sidebar = () => {
  return (
    <div className=" w-full sticky top-12 md:h-screen p-5 overflow-y-auto border border-slate-900 bg-slate-900/50">
      <h2>Select Options</h2>
      <Selectors />
      <Selectors />
      <Selectors />
      <Selectors />
    </div>
  );
};

export default Sidebar;
