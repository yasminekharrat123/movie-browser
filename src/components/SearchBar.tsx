import { Box, TextField } from '@mui/material';

interface Props {
  query: string;
  onChange: (q: string) => void;
}

export function SearchBar({ query, onChange }: Props) {
  return (
    <Box sx={{ p: 2 }}>
      <h6 className="text-3xl font-bold mb-2 font-sans">Movies</h6>
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
