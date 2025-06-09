import "./styles.css";
import { IoSearch } from "react-icons/io5";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const Search = ({
  value,
  onChange,
  placeholder,
  onKeyDown = () => {},
}: Props) => {
  return (
    <form className="search-container">
      <IoSearch className="search-icon" size={20} />
      <input
        className="search-input"
        type="search"
        placeholder={placeholder || "Search videos..."}
        value={value}
        onKeyDown={(e) => onKeyDown(e)}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
};

export default Search;
