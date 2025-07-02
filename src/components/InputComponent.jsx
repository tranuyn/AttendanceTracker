// components/InputComponent.jsx
import { Input, Select } from "antd";
import { Controller } from "react-hook-form";

const { Option } = Select;

export const InputComponent = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  options,
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: 500 }}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          Array.isArray(options) ? (
            <Select
              {...field}
              placeholder={placeholder}
              style={{ width: "100%" }}
            >
              {options.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          ) : (
            <Input {...field} placeholder={placeholder} type={type} />
          )
        }
      />
    </div>
  );
};
