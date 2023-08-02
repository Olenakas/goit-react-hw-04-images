import React, { useState, useEffect, useCallback } from 'react';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import SearchBar from 'components/Searchbar/Searchbar';
import Modal from 'components/Modal/Modal';
import LoadMore from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { ImgErrorView } from 'components/Error/error';
import css from '../App/App.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from 'services/api';

export default function App() {
  const [requestPicture, setRequestPicture] = useState('');
  const [pictureData, setPictureData] = useState([]); 
  const [largeImage, setLargeImage] = useState('');
  const [status, setStatus] = useState('idle');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const [errorKeyword, setErrorKeyword] = useState('');

  const loadPicture = useCallback(() => {
    setStatus('pending');

    api
      .fetchPicture(requestPicture, page)
      .then((res) => {
        const data = res.data.hits.map(({ id, webformatURL, largeImageURL }) => ({
          id,
          webformatURL,
          largeImageURL,
        }));
        const dataLength = res.data.hits.length;

        setPictureData((prevData) => [...prevData, ...data]);
        setStatus('resolved');
        setIsLoadingMore(dataLength === 12); 
        if (dataLength === 0) {
          setErrorKeyword(requestPicture);
          toast.error(`Images for the category"${requestPicture}" were not found`);
        }
      })
      .catch((error) => console.log(error));
  }, [requestPicture, page]);


  useEffect(() => {
    if (requestPicture !== '') {
      loadPicture();
    }
  }, [requestPicture, loadPicture]);

  useEffect(() => {
    if (page > 1) {
      loadPicture();
    }
  }, [page, loadPicture]);

  const handleFormSubmit = (requestPicture) => {
    setRequestPicture(requestPicture);
    setPage(1);
  };

  const handleSearchError = () => {
    toast.error('Enter a search query');
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const pictureModalClick = (picture) => {
    setLargeImage(picture);
  };

  const closeModal = () => {
    setLargeImage('');
  };

return (
  <div className={css.app}>
    <ToastContainer />
      {status === 'idle' ? (
        <React.Fragment>
          <SearchBar onSubmit={handleFormSubmit} onError={handleSearchError} />
          <div className={css.nameMessage}>Enter the name of the photo or picture</div>
        </React.Fragment>
      ) : (
        <SearchBar onSubmit={handleFormSubmit} onError={handleSearchError} />
      )}

      {status === 'resolved' && pictureData.length === 0 && (
        <ImgErrorView message={`Images for the category "${errorKeyword}" were not found.`} />
      )}

      {pictureData.length > 0 && (
        <ImageGallery pictureData={pictureData} onClick={pictureModalClick} />
      )}

      {status === 'pending' && <Loader />}

      {isLoadingMore && <LoadMore onClick={loadMore} />}

      {largeImage.length > 0 && (
        <Modal onClose={closeModal}>
          <img src={largeImage} alt="" />
        </Modal>
      )}
    </div>
  );
};
