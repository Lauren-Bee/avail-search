import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Slider, ButtonGroup } from '@mui/material';


function App() {
  const [searchString, setSearchString] = useState('');       // State for search query
  const [keywords, setKeywords] = useState('');       // State for search query
  const [center, setCenter] = useState('');       // State for selected NASA center
  const [media, setMedia] = useState('');       // State for selected media type
  const [startYear, setStartYear] = useState('');       // State for selected media type
  const [endYear, setEndYear] = useState('');       // State for selected media type
  const [data, setData] = useState([]);         // State for API results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);     // Error state
  const [validationError, setValidationError] = useState(''); // Validation error state
  const [images, setImages] = useState([]);
  const submitFlag = 0
  const [formData, setFormData] = useState({
    searchString: '',
    center: '',
    yearRange: [1920, 2024],
    media: 'image,video,audio',
    submitFlag: 0
  });
  const initialFormData = {
    searchString: '',
    center: '',
    media: 'image,video,audio',
    yearRange: [1920, 2024],
    submitFlag: 0
  };

  // NASA centers for the select box
  const nasaCenters = [
    { value: 'AFRC', label: 'Armstrong Flight Research Center (AFRC)' },
    { value: 'ARC', label: 'Ames Research Center (ARC)' },
    { value: 'GRC', label: 'Glenn Research Center (GRC)' },
    { value: 'HQ', label: 'Headquarters (HQ)' },
    { value: 'JPL', label: 'Jet Propulsion Laboratory (JPL)' },
    { value: 'JSC', label: 'Johnson Space Center (JSC)' },
    { value: 'KSC', label: 'Kennedy Space Center (KSC)' },
    { value: 'LRC', label: 'Langley Research Center (LRC)' },
    { value: 'MSFC', label: 'Marshall Space Flight Center (MSFC)' },
    { value: 'SSC', label: 'Stennis Space Center (SSC)' },
    { value: '', label: 'All Centers' }
    // Add more NASA centers here as needed
  ];

  // Media types for the select box
  const mediaTypes = [
    { value: 'image,video,audio', label: 'All' },
    { value: 'audio', label: 'Audio' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Video' }
  ];

  //Handle form submission to fetch API results

  const handleReset = () => {
    // Reset form data and images to initial states
    setFormData(initialFormData);
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the API query parameters
    const { center, yearRange, searchString, media } = formData;
    const query = {
      center: center,
      year_start: yearRange[0],
      year_end: yearRange[1],
      media_type: media,
      //page_size: 1000,
      q: searchString ? searchString : ''  // you can replace 'space' with another search term,
    };

    // Build the API query string
    const queryString = new URLSearchParams(query).toString();
    const apiUrl = `https://images-api.nasa.gov/search?${queryString}`;

    // Fetch data from the NASA API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const items = data.collection.items;
        // Extract image URLs from the API response
        const imageUrls = items.map((item) => {
          const links = item.links;
          return links && links[0] ? links[0].href : null;
        }).filter(url => url !== null);

        setImages(imageUrls);
      })
      .catch((error) => {
        console.error('Error fetching data from NASA API:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleYearRangeChange = (event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      yearRange: newValue,
    }));
  };

  return (
    <div className="App">
      <Box component="section" sx={{ maxWidth: 400, mx: 'auto' }}>
        <h1>NASA AVAIL Advanced Search</h1>
        <p>This site allows you to perform advanced searches of NASA's AVAIL repository using parameters available via the API. All data from images.nasa.gov. <b>Note that this only works for images at the moment. More search parameters and features to be added.</b></p>
      </Box>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <form id="avail-search" onSubmit={handleSubmit} onReset={handleReset}>
          {/* Query Input */}
          <TextField
            fullWidth
            label="Search terms"
            name="searchString"
            value={formData.searchString}
            onChange={handleChange}
            margin="normal"
          />

          {/* NASA Center Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="nasa-center-label">NASA Center</InputLabel>
            <Select
              labelId="nasa-center-label"
              name="center"
              value={formData.center}
              onChange={handleChange}
              label="NASA Center"
            >
              {nasaCenters.map((center) => (
                <MenuItem key={center.value} value={center.value}>
                  {center.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Media Type Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="media-label">Media Type</InputLabel>
            <Select
              labelId="media-label"
              name="media"
              value={formData.media}
              onChange={handleChange}
              label="Media Type"
            >
              {mediaTypes.map((media) => (
                <MenuItem key={media.value} value={media.value}>
                  {media.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Year Range Slider */}
          <FormControl fullWidth margin="normal">
            <Typography gutterBottom>Year Range</Typography>
            <Slider
              value={formData.yearRange}
              onChange={handleYearRangeChange}
              valueLabelDisplay="auto"
              min={1920}
              max={2024}
            />
            <Typography>
              Selected Range: {formData.yearRange[0]} - {formData.yearRange[1]}
            </Typography>
          </FormControl>

          <ButtonGroup spacing="2rem" aria-label="spacing button group" fullWidth>
            <Button type="submit" color="primary">
              Submit
            </Button>
            <Button type="reset" color="primary">
              Reset
            </Button>
          </ButtonGroup>
        </form>
      </Box>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        {images.length == 0 &&
          <p>No Results</p>}
      </Box>
      <Box component="section" sx={{ maxWidth: 1600, mx: 'auto', mt: 4 }}>
        {images.length > 0 && (<ImageList variant="masonry" cols={3} gap={12}>
          {images.map((url, index) => (
            <ImageListItem key={index}>
              <img
                src={url}
                //alt={item.data[0].title}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
              {/* <ImageListItemBar
                title={item.data[0].title}
                subtitle={<span>created: {new Date(item.data[0].date_created).toLocaleDateString()}</span>}
                position="below"
              /> */}
            </ImageListItem>
          ))}
        </ImageList>)}
      </Box>
    </div >
  );
}

export default App;