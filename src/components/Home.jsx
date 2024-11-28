import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  Pagination,
  IconButton,
} from "@mui/material";
import { FiSettings } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchQuery = searchParams.get("query") || "";
  const filterTag = searchParams.get("tags") || "story";
  const page = Number(searchParams.get("page")) || 0;

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/");
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${searchQuery}&tags=${filterTag}&page=${page}`
      );
      const data = await response.json();
      setSearchResults(data.hits || []);
      setTotalPages(data.nbPages || 1);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ query: searchQuery, tags: filterTag, page: 0 });
  };

  const handlePagination = (event, value) => {
    setSearchParams({ query: searchQuery, tags: filterTag, page: value - 1 });
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchParams]);

  return (
    <Box sx={{ backgroundColor: "#f6f6ef" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          backgroundColor: "#ff742b",
          color: "white",
          height: "60px",
        }}
      >
        <Typography variant="h6" sx={{ color: "black", fontWeight: "500" }}>
          Hello, {user?.username || "User"}!
        </Typography>
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          <TextField
            placeholder="Search stories by title, url or author"
            size="small"
            value={searchQuery}
            onChange={(e) =>
              setSearchParams({
                query: e.target.value,
                tags: filterTag,
                page: 0,
              })
            }
            sx={{
              minWidth: "700px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "transparent", // Removes the hover effect border
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // Removes the focus outline border
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{
                    color: "#ff742b",
                    marginRight: 2,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              ),
            }}
          />
        </form>
        <IconButton
          sx={{
            color: "black",
            padding: "6px",
            ":hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <FiSettings fontSize={25} />
        </IconButton>
      </Box>
      <Box sx={{display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.5rem 1rem"}}>
        search
        <Select
          value={filterTag}
          size="small"
          onChange={(e) =>
            setSearchParams({
              query: searchQuery,
              tags: e.target.value,
              page: 0,
            })
          }
        >
          <MenuItem value="story">Story</MenuItem>
          <MenuItem value="comment">Comment</MenuItem>
          <MenuItem value="poll">Poll</MenuItem>
        </Select>
        by
        <Select
          value={filterTag}
          size="small"
          onChange={(e) =>
            setSearchParams({
              query: searchQuery,
              tags: e.target.value,
              page: 0,
            })
          }
        >
          <MenuItem value="story">Story</MenuItem>
          <MenuItem value="comment">Comment</MenuItem>
          <MenuItem value="poll">Poll</MenuItem>
        </Select>
        for
        <Select
          value={filterTag}
          size="small"
          onChange={(e) =>
            setSearchParams({
              query: searchQuery,
              tags: e.target.value,
              page: 0,
            })
          }
        >
          <MenuItem value="story">Story</MenuItem>
          <MenuItem value="comment">Comment</MenuItem>
          <MenuItem value="poll">Poll</MenuItem>
        </Select>
      </Box>
      <Box sx={{ padding: "1rem", backgroundColor: "#f6f6ef" }}>
        {searchResults.map((result) => (
          <Box key={result.objectID} sx={{ marginBottom: "1.5rem" }}>
            <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <a
                  href={`https://news.ycombinator.com/item?id=${result.objectID}`}
                  target="_blank"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {result.title || "No Title Available"}
                </a>
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "400" }}
                color="textSecondary"
              >
                <a
                  href={result.url}
                  target="_blank"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {`(${result.url})`}
                </a>
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              <a
                href={`https://news.ycombinator.com/item?id=${result.objectID}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {result.points || 0} points
              </a>{" "}
              |{" "}
              <a
                href={`https://news.ycombinator.com/user?id=${result.author}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {result.author || "Unknown"}
              </a>{" "}
              |{" "}
              <a
                href={`https://news.ycombinator.com/item?id=${result.objectID}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {result.created_at || "Unknown time"}
              </a>{" "}
              |{" "}
              <a
                href={`https://news.ycombinator.com/item?id=${result.objectID}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {result.num_comments || 0} comments
              </a>
            </Typography>
          </Box>
        ))}
      </Box>

      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={handlePagination}
        onClick={window.scroll(0, 0)}
        color="standard"
        sx={{
          justifyContent: "center",
          display: "flex",
          "& .MuiPaginationItem-root": {
            color: "#ff742b", // Orange color for the default state
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#ff742b", // Orange background when selected
            color: "white", // White text when selected
          },
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "#ff742b", // Orange background on hover
            color: "white", // White text on hover
          },
        }}
      />
    </Box>
  );
};

export default Home;
