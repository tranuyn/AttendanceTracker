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
  rules = {},
}) => {
  const isSelect = Array.isArray(options);

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: 500 }}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) =>
          isSelect ? (
            <>
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
              {error && (
                <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                  {error.message}
                </div>
              )}
            </>
          ) : (
            <>
              <Input
                {...field}
                placeholder={placeholder}
                type={type}
              />
              {error && (
                <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                  {error.message}
                </div>
              )}
            </>
          )
        }
      />
    </div>
  );
};
