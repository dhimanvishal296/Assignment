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
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const filterTag = searchParams.get("tags") || "story";
  const page = Number(searchParams.get("page")) || 0;
  const timeRange = searchParams.get("timeRange") || "all";
  const sortBy = searchParams.get("sortBy") || "popularity";
  const sortParameter = sortBy === "date" ? "search_by_date" : "search";

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
      let numericFilter = "";

      // Time range logic
      const now = Math.floor(Date.now() / 1000);
      switch (timeRange) {
        case "last24h":
          numericFilter = `created_at_i>${now - 86400}`;
          break;
        case "pastWeek":
          numericFilter = `created_at_i>${now - 7 * 86400}`;
          break;
        case "pastMonth":
          numericFilter = `created_at_i>${now - 30 * 86400}`;
          break;
        case "pastYear":
          numericFilter = `created_at_i>${now - 365 * 86400}`;
          break;
        default:
          break;
      }

      const response = await fetch(
        `https://hn.algolia.com/api/v1/${sortParameter}?query=${searchQuery}&tags=${filterTag}&numericFilters=${numericFilter}&page=${page}`
      );

      const data = await response.json();
      setSearchResults(data.hits || []);
      setTotalPages(data.nbPages || 1);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      query: searchQuery,
      tags: filterTag,
      page: 0,
      timeRange,
    });
  };

  const handlePagination = (event, value) => {
    setSearchParams({
      query: searchQuery,
      tags: filterTag,
      page: value - 1,
      timeRange,
    });
  };

  const handleFilterChange = (key, value) => {
    setSearchParams({
      query: searchQuery,
      tags: key === "tags" ? value : filterTag,
      page: 0,
      timeRange: key === "timeRange" ? value : timeRange,
      sortBy: key === "sortBy" ? value : sortBy, // Add this
    });
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchParams]);

  return (
    <Box sx={{ backgroundColor: "#f6f6ef" }}>
      {/* Header */}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: "700px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "transparent" },
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

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.5rem 1rem",
        }}
      >
        search
        <Select
          value={filterTag}
          size="small"
          onChange={(e) => handleFilterChange("tags", e.target.value)}
        >
          <MenuItem value="story">Story</MenuItem>
          <MenuItem value="poll">Poll</MenuItem>
          <MenuItem value="comment">Comment</MenuItem>
        </Select>
        by
        <Select
          size="small"
          value={searchParams.get("sortBy") || "popularity"}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
        >
          <MenuItem value="popularity">Popularity</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
        for
        <Select
          size="small"
          value={timeRange}
          onChange={(e) => handleFilterChange("timeRange", e.target.value)}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="last24h">Last 24h</MenuItem>
          <MenuItem value="pastWeek">Past Week</MenuItem>
          <MenuItem value="pastMonth">Past Month</MenuItem>
          <MenuItem value="pastYear">Past Year</MenuItem>
        </Select>
      </Box>

      {/* Results */}
      <Box sx={{ padding: "1rem", backgroundColor: "#f6f6ef" }}>
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <Box key={result.objectID} sx={{ marginBottom: "1.5rem" }}>
              <Box
                sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  <a
                    href={`https://news.ycombinator.com/item?id=${result.objectID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {result.title || "No Title Available"}
                  </a>
                </Typography>
                {result.url && (
                  <Typography variant="body2" color="textSecondary">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {`(${result.url})`}
                    </a>
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                {result.points || 0} points | {result.author || "Unknown"} |{" "}
                {result.num_comments || 0} comments
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No results found</Typography>
        )}
      </Box>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={handlePagination}
        color="standard"
        sx={{
          justifyContent: "center",
          display: "flex",
          "& .MuiPaginationItem-root": {
            color: "#ff742b",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#ff742b",
            color: "white",
          },
        }}
      />
    </Box>
  );
};

export default Home;
