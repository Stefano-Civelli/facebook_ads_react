import Selectors from "./Selectors";

const Sidebar = () => (
  <div className=" w-full sticky top-12 md:h-screen bg-gray-200 p-5 overflow-y-auto  bg-gray-500 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-50 saturate-100 backdrop-contrast-100">
    <h2>Select Options</h2>
    <Selectors />
    <Selectors />
    <Selectors />
    <Selectors />
  </div>
);

export default Sidebar;
