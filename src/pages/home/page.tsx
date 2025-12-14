import { useState, useMemo, useEffect } from 'react';
import SearchInput from '../../components/base/SearchInput';
import CategoryFilter from '../../components/base/CategoryFilter';
import TimeFilter from '../../components/base/TimeFilter';
import SentimentFilter from '../../components/base/SentimentFilter';
import NewsCard from '../../components/base/NewsCard';
import MusicRecommendation from '../../components/base/MusicRecommendation';
import { newsCategories, sentimentOptions } from '../../mocks/newsData';
import { fetchNews } from '../../services/newsApi';
import type { NewsItem, FetchNewsResult } from '../../services/newsApi';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('전체');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 뉴스 데이터 가져오기
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchNews({
          numOfRows,
          pageNo: 1,
          returnType: 'json'
        });
        setTotalCount(result.totalCount);
        setPageNo(1);
        
        // 날짜 기준 내림차순 정렬 (최신순)
        const sortedData = result.items.sort((a, b) => {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return dateB - dateA;
        });
        
        console.log('최종 로드된 뉴스:', sortedData);
        setNewsData(sortedData);
      } catch (err: any) {
        console.error('뉴스 로딩 실패:', err);
        setError(err.message ?? '뉴스를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, [numOfRows]);

  const loadNextPage = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const nextPage = pageNo + 1;
      const result: FetchNewsResult = await fetchNews({
        numOfRows,
        pageNo: nextPage,
        returnType: 'json'
      });
      setTotalCount(result.totalCount);
      setPageNo(nextPage);
      // 기존 데이터에 이어붙이고 최신순 정렬 유지
      const merged = [...newsData, ...result.items].sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      });
      setNewsData(merged);
    } catch (err: any) {
      console.error('다음 페이지 로딩 실패:', err);
      setError(err.message ?? '다음 페이지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPrevPage = async () => {
    if (isLoading) return;
    if (pageNo <= 1) return;
    setIsLoading(true);
    setError(null);
    try {
      const prevPage = pageNo - 1;
      const result: FetchNewsResult = await fetchNews({
        numOfRows,
        pageNo: prevPage,
        returnType: 'json'
      });
      setTotalCount(result.totalCount);
      setPageNo(prevPage);
      // 이전 페이지 데이터를 앞에 배치하고 최신순 정렬 유지
      const merged = [...result.items, ...newsData].sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      });
      setNewsData(merged);
    } catch (err: any) {
      console.error('이전 페이지 로딩 실패:', err);
      setError(err.message ?? '이전 페이지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNews = useMemo(() => {
    const normalize = (s: string | undefined) => (s ?? '').trim();
    return newsData.filter(news => {
      // 검색어 필터
      const matchesSearch = searchQuery === '' ||
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchQuery.toLowerCase());

      // 카테고리 필터
      const matchesCategory = selectedCategory === '전체' || normalize(news.category) === normalize(selectedCategory);

      // 감정 필터
      const matchesSentiment = selectedSentiment === '전체' || normalize(news.sentiment) === normalize(selectedSentiment);

      // 시간 필터 (간단한 구현)
      const matchesTime = selectedTimeFilter === 'all' || true; // 실제 API 연동시 구현

      return matchesSearch && matchesCategory && matchesSentiment && matchesTime;
    });
  }, [searchQuery, selectedCategory, selectedSentiment, selectedTimeFilter, newsData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>
                NewsHub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <i className="ri-notification-line text-xl text-gray-600 cursor-pointer hover:text-gray-800"></i>
              <i className="ri-settings-line text-xl text-gray-600 cursor-pointer hover:text-gray-800"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-6">
            {/* Search */}
            {/* SearchInput 컴포넌트는 onSearch(query) 형태를 기대합니다 */}
            <SearchInput
              onSearch={(q: string) => setSearchQuery(q)}
              placeholder="뉴스 제목이나 내용을 검색하세요..."
            />

            {/* Filters */}
            <div className="space-y-4">
              {/* Category Filter */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={newsCategories}
              />

              {/* Sentiment Filter */}
              <SentimentFilter
                selectedSentiment={selectedSentiment}
                onSentimentChange={setSelectedSentiment}
                sentimentOptions={sentimentOptions}
              />

              {/* Time Filter: TimeFilter.tsx은 selectedTime / onTimeChange를 기대합니다 */}
              <TimeFilter
                selectedTime={selectedTimeFilter}
                onTimeChange={setSelectedTimeFilter}
              />
            </div>
          </div>
        </div>

        {/* Music Recommendation */}
        <MusicRecommendation selectedSentiment={selectedSentiment} />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              뉴스 기사 ({filteredNews.length}개)
            </h2>
            {selectedSentiment !== '전체' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">감정 필터:</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${selectedSentiment === '긍정' ? 'bg-green-100 text-green-800' : ''}
                  ${selectedSentiment === '중립' ? 'bg-blue-100 text-blue-800' : ''}
                  ${selectedSentiment === '부정' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {selectedSentiment}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <i className="ri-time-line"></i>
            <span>실시간 업데이트</span>
          </div>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">뉴스를 불러오는 중...</h3>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <i className="ri-error-warning-line text-4xl text-red-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => (
              // NewsCard의 news 타입에 sentiment 필드가 필요하므로 항상 포함되도록 보장
              <NewsCard
                key={news.id}
                news={{
                  ...news,
                  sentiment: news.sentiment ?? '전체',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}

        {/* Pagination: 이전/다음 페이지 버튼 */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={loadPrevPage}
            className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium shadow-sm disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isLoading || pageNo <= 1}
          >
            이전 페이지 ({Math.max(1, pageNo - 1)})
          </button>
          {newsData.length < totalCount && (
            <button
              onClick={loadNextPage}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm disabled:bg-gray-300"
              disabled={isLoading}
            >
              다음 페이지 ({pageNo + 1})
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>
                NewsHub
              </h3>
              <span className="text-sm text-gray-600">AI 기반 뉴스 감정 분석 서비스</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2024 NewsHub. 
              <a href="https://readdy.ai/?origin=logo" className="ml-2 text-blue-600 hover:text-blue-800">
                Powered by Readdy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}