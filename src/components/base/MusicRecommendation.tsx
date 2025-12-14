
import { useState } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  duration: string;
  imageUrl: string;
  spotifyUrl?: string;
}

interface MusicRecommendationProps {
  selectedSentiment: string;
}

const musicData: Song[] = [
  // 긍정적인 노래들
  {
    id: '1',
    title: 'Happy',
    artist: 'Pharrell Williams',
    genre: 'Pop',
    mood: '긍정',
    duration: '3:53',
    imageUrl: 'https://readdy.ai/api/search-image?query=Happy%20upbeat%20music%20album%20cover%20with%20bright%20colors%2C%20energetic%20vibes%2C%20positive%20atmosphere%2C%20modern%20design&width=200&height=200&seq=music1&orientation=squarish',
    spotifyUrl: '#'
  },
  {
    id: '2',
    title: 'Good as Hell',
    artist: 'Lizzo',
    genre: 'Pop',
    mood: '긍정',
    duration: '2:39',
    imageUrl: 'https://readdy.ai/api/search-image?query=Empowering%20pop%20music%20album%20cover%20with%20vibrant%20colors%2C%20confident%20energy%2C%20uplifting%20design%2C%20modern%20aesthetic&width=200&height=200&seq=music2&orientation=squarish',
    spotifyUrl: '#'
  },
  {
    id: '3',
    title: 'Dynamite',
    artist: 'BTS',
    genre: 'K-Pop',
    mood: '긍정',
    duration: '3:19',
    imageUrl: 'https://readdy.ai/api/search-image?query=K-pop%20album%20cover%20with%20explosive%20energy%2C%20colorful%20design%2C%20dynamic%20elements%2C%20Korean%20pop%20music%20style&width=200&height=200&seq=music3&orientation=squarish',
    spotifyUrl: '#'
  },
  // 중립적인 노래들
  {
    id: '4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Synthpop',
    mood: '중립',
    duration: '3:20',
    imageUrl: 'https://readdy.ai/api/search-image?query=Synthpop%20album%20cover%20with%20neon%20lights%2C%20retro%20futuristic%20design%2C%20balanced%20mood%2C%20electronic%20music%20aesthetic&width=200&height=200&seq=music4&orientation=squarish',
    spotifyUrl: '#'
  },
  {
    id: '5',
    title: 'Levitating',
    artist: 'Dua Lipa',
    genre: 'Pop',
    mood: '중립',
    duration: '3:23',
    imageUrl: 'https://readdy.ai/api/search-image?query=Modern%20pop%20album%20cover%20with%20cosmic%20theme%2C%20balanced%20energy%2C%20contemporary%20design%2C%20space%20elements&width=200&height=200&seq=music5&orientation=squarish',
    spotifyUrl: '#'
  },
  {
    id: '6',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    genre: 'Pop',
    mood: '중립',
    duration: '2:21',
    imageUrl: 'https://readdy.ai/api/search-image?query=Contemporary%20pop%20collaboration%20album%20cover%2C%20modern%20design%2C%20neutral%20mood%2C%20artistic%20aesthetic&width=200&height=200&seq=music6&orientation=squarish',
    spotifyUrl: '#'
  },
  // 부정적인/감성적인 노래들
  {
    id: '7',
    title: 'Someone Like You',
    artist: 'Adele',
    genre: 'Ballad',
    mood: '부정',
    duration: '4:45',
    imageUrl: 'https://readdy.ai/api/search-image?query=Emotional%20ballad%20album%20cover%20with%20melancholic%20atmosphere%2C%20soft%20colors%2C%20introspective%20mood%2C%20artistic%20design&width=200&height=200&seq=music7&orientation=squarish',
    spotifyUrl: '#'
  },
  {
    id: '8',
    title: 'Hurt',
    artist: 'Johnny Cash',
    genre: 'Country',
    mood: '부정',
    duration: '3:38',
    imageUrl: 'https://readdy.ai/api/search-image?query=Dark%20country%20music%20album%20cover%20with%20somber%20mood%2C%20vintage%20aesthetic%2C%20emotional%20depth%2C%20classic%20design&width=200&height=200&seq=music8&orientation=squarish',
    spotifyUrl: '#'
  },
  {
    id: '9',
    title: 'Mad World',
    artist: 'Gary Jules',
    genre: 'Alternative',
    mood: '부정',
    duration: '3:07',
    imageUrl: 'https://readdy.ai/api/search-image?query=Alternative%20music%20album%20cover%20with%20dark%20atmosphere%2C%20moody%20design%2C%20introspective%20elements%2C%20artistic%20style&width=200&height=200&seq=music9&orientation=squarish',
    spotifyUrl: '#'
  }
];

export default function MusicRecommendation({ selectedSentiment }: MusicRecommendationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRecommendedSongs = () => {
    if (selectedSentiment === '전체') {
      return musicData.slice(0, 3);
    }
    return musicData.filter(song => song.mood === selectedSentiment).slice(0, 3);
  };

  const getMoodDescription = () => {
    switch (selectedSentiment) {
      case '긍정':
        return '기분 좋은 하루를 위한 신나는 음악';
      case '중립':
        return '편안한 일상을 위한 차분한 음악';
      case '부정':
        return '감정을 달래주는 위로의 음악';
      default:
        return '다양한 기분에 맞는 추천 음악';
    }
  };

  const getMoodIcon = () => {
    switch (selectedSentiment) {
      case '긍정':
        return 'ri-music-2-line text-green-600';
      case '중립':
        return 'ri-music-2-line text-blue-600';
      case '부정':
        return 'ri-music-2-line text-red-600';
      default:
        return 'ri-music-2-line text-gray-600';
    }
  };

  const recommendedSongs = getRecommendedSongs();

  if (recommendedSongs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <i className={`${getMoodIcon()} text-xl`}></i>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">음악 추천</h3>
            <p className="text-sm text-gray-600">{getMoodDescription()}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap"
        >
          <span>{isExpanded ? '접기' : '더보기'}</span>
          <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`}></i>
        </button>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isExpanded ? '' : 'md:grid-cols-3'}`}>
        {recommendedSongs.map((song) => (
          <div key={song.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{song.title}</h4>
              <p className="text-xs text-gray-600 truncate">{song.artist}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{song.genre}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{song.duration}</span>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 cursor-pointer">
              <i className="ri-play-circle-line text-lg"></i>
            </button>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicData
              .filter(song => selectedSentiment === '전체' || song.mood === selectedSentiment)
              .slice(3)
              .map((song) => (
                <div key={song.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{song.title}</h4>
                    <p className="text-xs text-gray-600 truncate">{song.artist}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{song.genre}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{song.duration}</span>
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 cursor-pointer">
                    <i className="ri-play-circle-line text-lg"></i>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <i className="ri-spotify-line"></i>
            <span>Spotify에서 듣기</span>
          </div>
          <div className="flex items-center space-x-1">
            <i className="ri-music-line"></i>
            <span>Apple Music에서 듣기</span>
          </div>
        </div>
      </div>
    </div>
  );
}
