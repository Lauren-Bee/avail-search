import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Slider, ButtonGroup, Dialog, DialogTitle, DialogContent } from '@mui/material';


function App() {

  const [selectedItem, setSelectedItem] = useState(null); // Store the clicked item for modal
  const [open, setOpen] = useState(false); // Modal open/close state
  const [items, setItems] = useState([]); // Store full API response items here
  const [formData, setFormData] = useState({
    searchString: '',
    center: '',
    media: 'image,video,audio',
    yearRange: [1920, 2024],
    location: '',
    creator: '',
    secondary_creator: '',
    keywords: ''
  });
  const initialFormData = {
    searchString: '',
    center: '',
    media: 'image,video,audio',
    yearRange: [1920, 2024],
    location: '',
    creator: '',
    secondary_creator: '',
    keywords: ''
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

  const handleClickImage = (item) => {
    setSelectedItem(item);  // Store the clicked item
    setOpen(true);  // Open the modal
  };

  const handleClose = () => {
    setOpen(false);  // Close the modal
  };

  //Handle form submission to fetch API results

  const handleReset = () => {
    // Reset form data and images to initial states
    setFormData(initialFormData);
    setItems([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the API query parameters
    const { center, yearRange, searchString, media, creator, secondary_creator, location, keywords } = formData;
    const query = {
      center: center,
      year_start: yearRange[0],
      year_end: yearRange[1],
      media_type: media,
      location: location,
      photographer: creator,
      secondary_creator: secondary_creator,
      keywords: keywords,
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
        setItems(items);  // Store full items array
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

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Primary Creator"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Secondary Creator"
            name="secondary_creator"
            value={formData.secondary_creator}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Keywords (separate with comma)"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            margin="normal"
          />

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
      <Box component="section" sx={{ maxWidth: 1600, mx: 'auto', mt: 4 }}>
        {items.length > 0 && (<ImageList variant="masonry" cols={3} gap={12}>
          {items.map((item, index) => (
            <ImageListItem key={index} onClick={() => handleClickImage(item)}>
              <img
                src={item.links && item.links[0] ? item.links[0].href : null}
                //alt={item.data[0].title}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
              <ImageListItemBar
                title={item.data[0].title}
                subtitle={<span>{item.data[0].photographer} ({item.data[0].center})<br />{new Date(item.data[0].date_created).toLocaleDateString()}<br />{item.data[0].location}</span>}
                position="below"
              />
            </ImageListItem>
          ))}
        </ImageList>)}

        {/* Modal Dialog for Image Details */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Image Details</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <>
                <Typography variant="h6">{selectedItem.data[0].title}</Typography>
                <img
                  src={selectedItem.links[0].href}
                  alt={selectedItem.data[0].title}
                  style={{ width: '100%', marginTop: '16px' }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {selectedItem.data[0].description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Date Created: {new Date(selectedItem.data[0].date_created).toLocaleDateString()}
                </Typography>
              </>
            )}
          </DialogContent>
        </Dialog>

      </Box>
    </div >
  );
}

export default App;