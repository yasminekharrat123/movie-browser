import { Box, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";

interface Props {
  query: string;
  onChange: (q: string) => void;
}

export function SearchBar({ query, onChange }: Props) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Movies
      </Typography>
      <TextField
        placeholder="Search movies..."
        fullWidth
        value={query}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
    </Box>
  );
}
