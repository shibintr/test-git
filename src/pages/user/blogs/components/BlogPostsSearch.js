import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { paramCase } from "change-case";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Autocomplete,
  InputAdornment,
  Link,
  Popper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// hooks
import useIsMountedRef from "src/hooks/useIsMountedRef";
// utils
import axios from "src/utils/axios";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import InputStyle from "src/components/InputStyle";
import SearchNotFound from "src/components/SearchNotFound";

// ----------------------------------------------------------------------

const PopperStyle = styled((props) => (
  <Popper placement="bottom-start" {...props} />
))({
  width: "280px !important",
});

// ----------------------------------------------------------------------

export default function BlogPostsSearch() {
  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const handleChangeSearch = async (value) => {
    try {
      setSearchQuery(value);
      if (value) {
        const response = await axios.get("/api/blog/posts/search", {
          params: { query: value },
        });

        if (isMountedRef.current) {
          setSearchResults(response.data.results);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (title) => {
    navigate(PATH_DASHBOARD.blog.view(paramCase(title)));
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      handleClick(searchQuery);
    }
  };

  return (
    <Autocomplete
      size="small"
      autoHighlight
      popupIcon={null}
      PopperComponent={PopperStyle}
      options={searchResults}
      onInputChange={(event, value) => handleChangeSearch(value)}
      getOptionLabel={(post) => post.title}
      noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <InputStyle
          {...params}
          stretchStart={200}
          placeholder={"userBlog.searchPost"}
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon={"eva:search-fill"}
                  sx={{ ml: 1, width: 20, height: 20, color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, post, { inputValue }) => {
        const { title, cover } = post;
        const matches = match(title, inputValue);
        const parts = parse(title, matches);

        return (
          <li {...props}>
            <Image
              alt={cover}
              src={cover}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                flexShrink: 0,
                mr: 1.5,
              }}
            />
            <Link underline="none" onClick={() => handleClick(title)}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  variant="subtitle2"
                  color={part.highlight ? "primary" : "textPrimary"}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}
