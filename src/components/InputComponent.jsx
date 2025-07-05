// components/InputComponent.jsx
import { Input, Select, DatePicker } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

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
  const isDate = type === "date";

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: 500 }}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          if (isSelect) {
            return (
              <>
                <Select
                  {...field}
                  placeholder={placeholder}
                  style={{ width: "100%" }}
                  value={field.value || undefined}
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
            );
          }

          if (isDate) {
            return (
              <>
                <DatePicker
                  {...field}
                  placeholder={placeholder}
                  format="DD/MM/YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                  style={{ width: "100%" }}
                />
                {error && (
                  <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                    {error.message}
                  </div>
                )}
              </>
            );
          }

          return (
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
          );
        }}
      />
    </div>
  );
};
