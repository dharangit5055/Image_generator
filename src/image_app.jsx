import React, { useState } from "react";
import { FaDownload } from "react-icons/fa6";

function Image() {
  const accessKey = "7iig8LbIgnB79JDAocG1VLN59iOXSE7WZQHegNctzQo";

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);

  async function searchImages() {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    const response = await fetch(url);
    const data = await response.json();
    if (page === 1) {
      setImages(data.results);
    } else {
      setImages((prevImages) => [...prevImages, ...data.results]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    searchImages();
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    searchImages();
  };

  const handleDownload = async (imageUrl) => {
    try {
      // Fetch the image data
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a blob URL for the image
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "image"; // You can set the default download filename here
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Cleanup
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div>
      <h1>Image Generator</h1>
      <form action="" id="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="search-box"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="what comes to your mind!!!"
        />
        <button type="submit">Search</button>
      </form>
      <div id="search-result">
        {images.map((image) => (
          <div key={image.id}>
            <img src={image.urls.small} alt={image.alt_description} />
            <button
              id="dwn-btn"
              onClick={() => handleDownload(image.urls.full)}
            >
              Download <FaDownload />
            </button>
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <button id="show-more-btn" onClick={handleLoadMore}>
          Load more...
        </button>
      )}
    </div>
  );
}

export default Image;
