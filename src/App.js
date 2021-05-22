import './App.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SplashPage from './components/SplashPage';

//Declaring name space structure for app.
const app = {};

//Variable declaring the Giphy API key
app.giphyKey = `J0Mq3DGHVu2HtcdoS7QMvJX0qMJ359VA`;
//Variable declaring Movie DB key
app.mDbKey = `5b4cfcb5bfcdfe63f43999ac1acbfb53`;

function App() {
  // PSEUDOCODE
  // Text input with search button
  // get input value (we're looking for a movie title)
  // make a query to moviedb based on our movie title
  // save the titles,ids and overviews of the top 3 movies returned in state
  // populate a list of buttons with the movie titles of the top 3 results of the api call
  // User selects their movie and clicks appropriate button
  // Display a loading state because this part will take ages
  // make an axios/fetch call to moviedb based on the chosen movie's ID to get a random set of 3 keywords(MAYBE DO THIS BEFORE THEY SELECT THE MOVE?? AND DO IT FOR ALL 3 MOVIE OPTIONS -- STRETCH)
  // Using the keywords returned by the 2nd movieDB call, make a search query to giphy for each keyword
  // save the 3 gif urls to individual states
  // Render the gifs on the page using the urls and the movie overview saved in state
  // include a start-over button that clears the results component and returns the app to its original state. 

  //STRETCH GOALS: shareable results using routing? :O

  //List of components to build:
  // 1 - Splash Page
        //* h1
        //* p
        //* form
        //* form input
        //* submit button
  
  // 2 - Loading Page
        //* h1 - or some text element
        //* div - that holds animation
        //* conditionally rendered error message

  // 3 - Results page
        //* h1
        //* image gallery
        //* paragraph for movie overview
        //* clear button
  
  // 4 - Footer
        //* text
      




  return (
    <div>
      <SplashPage />
    </div>
  );
}

export default App;
