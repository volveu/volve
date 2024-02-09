import { createTheme, ThemeProvider } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { type Tag } from "@prisma/client";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const TagSelectField = ({
  tags,
  values,
  setValues,
}: {
  tags: Tag[];
  values: Tag[];
  setValues: (tags: Tag[]) => void;
}) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Autocomplete
        multiple
        id="tags-filled"
        options={tags?.map((tag) => tag.title) ?? []}
        freeSolo
        value={values.map((tag) => tag.title)}
        onChange={(_, newValue) => {
          console.log(newValue);
          setValues(newValue.map((tag) => ({ title: tag })));
        }}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            // when adding a key, it throws an error saying that it already has a key
            // from the getTagProps function
            // eslint-disable-next-line react/jsx-key
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Tags"
            placeholder="Add a tag"
            sx={{
              ".MuiInputBase-input": {
                height: "2em",
              },
            }}
          />
        )}
      />
    </ThemeProvider>
  );
};

export default TagSelectField;
