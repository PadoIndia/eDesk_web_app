import { FC, useRef } from "react";
import "./styles.css";
import { IoClose, IoSearch } from "react-icons/io5";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  shouldSkipSubmit?: boolean;
};

const Search = ({
  value,
  onChange,
  placeholder,
  onKeyDown = () => {},
  shouldSkipSubmit = false,
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
        onChange={(e) => (shouldSkipSubmit ? {} : onChange(e.target.value))}
      />
    </form>
  );
};

export default Search;

interface SearchBoxProps {
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}

export const SearchBox: FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="form">
      <button type="button" className="btn border-0 btn-body">
        <IoSearch />
      </button>
      <input
        ref={inputRef}
        className="input"
        placeholder={placeholder || "Type your text"}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button className="reset border-0" type="button" onClick={handleReset}>
        <IoClose />
      </button>
    </div>
  );
};
