import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const DateAndTimePicker = ({
  value,
  setValue,
  label,
}: {
  value: Dayjs;
  setValue: (date: Dayjs) => void;
  label: string;
}) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          disablePast
          value={dayjs(value)}
          onChange={(newValue) => setValue(newValue ?? dayjs())}
          label={label}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DateAndTimePicker;
