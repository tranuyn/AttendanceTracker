import { useState } from "react";
import { Input } from "antd";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  return (
    <Input.Search
      placeholder="Tìm theo tên nhân viên..."
      allowClear
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSearch={(val) => onSearch(val)}
      style={{ width: 300 }}
    />
  );
}
