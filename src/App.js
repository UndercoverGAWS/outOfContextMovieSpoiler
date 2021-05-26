import './styles/App.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SplashPage from './components/SplashPage.js';
import LoadingPage from './components/LoadingPage.js';
import Results from './components/Results.js';
import Footer from './components/Footer';

//Declaring name space structure for app.
const oocms = {};

//Variable declaring the Giphy API key
oocms.giphyKey = '2hsXOQxDVBHbq5Ok1353va0m8wTJvV3j'
// `J0Mq3DGHVu2HtcdoS7QMvJX0qMJ359VA`;
// Variable to store Giphy endpoint
oocms.giphyURL = 'https://api.giphy.com/v1/gifs/search';
//Variable declaring Movie DB key
oocms.mDbKey = `5b4cfcb5bfcdfe63f43999ac1acbfb53`;
// Variable to store Movie DB endpoint
oocms.mDbTitleURL = 'https://api.themoviedb.org/3/search/movie/';
// oocms.movieDbKeywordURL = 'https://api.themoviedb.org/3/movie/{movieID}/keywords';



function App() {
  //STRETCH GOALS: shareable results using routing? :O
  //get a random set of 3 keywords(MAYBE DO THIS BEFORE THEY SELECT THE MOVE?? AND DO IT FOR ALL 3 MOVIE OPTIONS -- STRETCH)
  
  // 1 - Loading Page
  //* conditionally rendered error message


  // useStates located here:
  // State that store the initial movie results
  const [moviesArray, setMoviesArray] = useState([]);
  // State that stores the chosen movies overview
  const [movieOverview, setMovieOverview] = useState('');
  // state that stores the chosen movie title
  const [movieTitle, setMovieTitle] = useState('');
  // State that stores the keywords from the movie keyword api endpoint
  const [movieKeywords, setMovieKeywords] = useState([]);
  // State that saves the gifs in an array
  const [gifsArray, setGifsArray] = useState([]);
  // state that tracks the current page view
  const [pageView, setPageView] = useState('splash');

  // Function that sets movie overview in state
  const getOverview = (overview) => {
    setMovieOverview(overview)
    console.log(movieOverview)
  }

  const getTitle = (title) => {
    setMovieTitle(title);
    console.log(movieTitle);
  }

  // Function to take user input and make call to Movie DB API
  const getMovies = input => {
    axios({
      url: oocms.mDbTitleURL,
      method: 'GET',
      dataResponse: 'json',
      params: {
        api_key: oocms.mDbKey,
        query: input
      }
    })
      .then(response => {
        const resultsArray = response.data.results.slice(0, 3);
        // Mapping through the results of the api call and saving a simplified version of the data and saving it the the moviesArray
        const filteredArray = resultsArray.map(movie => {
          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date.match(/\d{4}/)
          };
        });
        setMoviesArray(filteredArray);
      })
  }



  console.log(moviesArray);

  // Function to get keywords from selected movie
  const getKeywords = id => {
    axios({
      url: `https://api.themoviedb.org/3/movie/${id}/keywords`,
      method: 'GET',
      dataResponse: 'json',
      params: {
        api_key: oocms.mDbKey
      }
    })
      .then(response => {
        // Saving keywords to the moviesKeywords state
        const randomIndex = Math.floor(Math.random() * response.data.keywords.length);
        
        // ! THIS IS EXPERIMENTAL
        const keywordsArray = [];
        const copiedKeywords = [...response.data.keywords]
        for (let i = 0; i < 3; i++) {
          const newRandom = Math.floor(Math.random() * copiedKeywords.length)
          const newKeyword = copiedKeywords.splice(newRandom, 1);
          keywordsArray.push(newKeyword[0]);
        }
        const keywords = response.data.keywords.slice(randomIndex, randomIndex + 3);
        console.log('KeywordsArray:', keywordsArray);
        setMovieKeywords(keywordsArray);
        // ! THE MADNESS END HERE
        
        console.log('Keywords:', keywords);
        // setMovieKeywords(keywords);
      });
  }

  useEffect(() => {

    // Creating an array so we can push the results from the gifs url into it
    let gifInfo = [];
    // initializinga  requests array to store the promises because promise.all requires an array
    let requests = [];


    // Calling the giphy api using the keywords saved in the movieKeywords state when the movieKeyword state changes using the dependency array
    movieKeywords.forEach(keyword => {
      // pushing the three giphy requests to a requests array
      requests.push(
        axios({
          method: "GET",
          url: oocms.giphyURL,
          dataResponse: 'json',
          params: {
            api_key: oocms.giphyKey,
            q: keyword.name
          }
        })
      )
    })
    // once all three promises have resolved, loop through the data and push it to the gifInfo array
    Promise.all(requests)
      .then(responses => {
        responses.forEach( (response) => {
          // Creating a test to determine if the current image has landscape dimensions
          const isLandscape = (image) => image.images.original.width / image.images.original.height >= 1.2;
          // Loop through returned images and return first index which passes the test
          const landscapeIndex = response.data.data.findIndex(isLandscape);
          gifInfo.push(
            {
              // Creating new object containing the image url and title, and pushing the object to gifInfo array
              url: response.data.data[landscapeIndex].images.original.url,
              alt: response.data.data[landscapeIndex].title
            }
          )
        })
        // set the gifsArray state to the gifInfo array
        setGifsArray(gifInfo)
        resultsState(gifInfo)
      })
    }, [movieKeywords])
    
    

  // function to set the viewState to "loading"
  const loadingState = () => {
    setPageView('loading')
  }

  // function to set the viewState to "results"
  const resultsState = (gifInfo) => {
    if(gifInfo.length > 0){
      setPageView('results')
    }
  }

  // function to set the viewState to "splash"
  const splashState = () => {
    setPageView('splash')
  }

  return (
    <div>
      {
        pageView === "splash" ?
          <SplashPage
            onSubmit={getMovies}
            moviesArray={moviesArray}
            getKeywords={getKeywords}
            getTitle={getTitle}
            getOverview={getOverview}
            loadingState={loadingState}
          />
          : null
      }
      {
        pageView === "loading" ?
          <LoadingPage />
          : null
      }
      {
        pageView === "results" ?
          <Results
            gifsArray={gifsArray}
            splashState={splashState}
            movieTitle={movieTitle}
            movieOverview={movieOverview}
            setMoviesArray={setMoviesArray}
          />
          : null
      }
      {
        pageView != "loading" ? 
        <Footer />
        : null
      }

      
      
    </div>
  );
}

export default App;
