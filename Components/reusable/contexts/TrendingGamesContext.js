import React, {useState, useEffect} from 'react';
import {api_call} from '../../helper_functions/api';

export const TrendingGamesContext = React.createContext(null);

export default function TrendingGames(props) {
  const [{trendingGames, trendingNext}, setTrendingGames] = useState({
    trendingGames: null,
    trendingNext: null,
  });

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    const _games = await api_call({
      apiUrl: '/games',
      body: {
        page_size: 10,
        metacritic: '80,100',
      },
    });
    if (_games) {
      if (_games !== null)
        setTrendingGames({
          trendingNext: _games.next,
          trendingGames: _games.results,
        });
    } else {
      console.log('error fetching');
    }
  };

  return (
    <TrendingGamesContext.Provider value={{trendingGames, trendingNext}}>
      {props.children}
    </TrendingGamesContext.Provider>
  );
}
