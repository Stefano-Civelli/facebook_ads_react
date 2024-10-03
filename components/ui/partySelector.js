import { cn } from "@/lib/util";

export const PartySelector = ({ value, onChange, className }) => {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <select
      className={cn("select select-xs z-10 bg-gray-800 text-white", className)}
      value={value}
      onChange={onChange}
      onClick={handleClick}
    >
      <option value="Labor">Labor</option>
      <option value="Liberal">Liberal</option>
      <option value="Greens">Greens</option>
      <option value="Independents">Independents</option>
      <option value="All">All</option>
    </select>
  );
};
