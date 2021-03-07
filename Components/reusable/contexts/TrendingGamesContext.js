import React, {useState, useEffect} from 'react';
import {api_call} from '../../helper_functions/api';

export const TrendingGamesContext = React.createContext(null);

export default function TrendingGames(props) {
  const [{trendingGames, trendingNext}, setTrendingGames] = useState({
    trendingGames: [],
    trendingNext: null,
  });

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchNext = async () => {
    if (trendingNext !== null) {
      const _games = await api_call({
        apiUrl: trendingNext,
        applyBaseURL: false,
      });
      if (_games) {
        const _allGamesSet = trendingGames.concat(_games.results);
        setTrendingGames({
          trendingGames: _allGamesSet,
          trendingNext: _games.next,
        });
      } else {
        console.log('Error fetching next');
      }
    }
  };

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
    <TrendingGamesContext.Provider
      value={{trendingGames, trendingNext, fetchNext}}>
      {props.children}
    </TrendingGamesContext.Provider>
  );
}
