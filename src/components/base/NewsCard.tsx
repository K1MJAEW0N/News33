import { useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  sentiment?: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
  url?: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${Math.floor(diffInHours / 24)}일 전`;
  };

  const handleReadMore = () => {
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer" onClick={handleReadMore}>
      {news.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {news.category}
          </span>
          <span className="text-gray-500 text-sm">{formatTime(news.publishedAt)}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {news.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {news.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm font-medium">{news.source}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleReadMore();
            }}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors"
          >
            자세히 보기
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-line"></i>
            </div>
          </button>
        </div>
      </div>
    </div>

      {/* 모달 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                  {news.category}
                </span>
                <span className="text-gray-500 text-sm">{news.source}</span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="px-6 py-6">
              {news.imageUrl && (
                <div className="w-full mb-6 rounded-lg overflow-hidden">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {news.title}
              </h2>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <i className="ri-calendar-line"></i>
                  <span>{formatDate(news.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-time-line"></i>
                  <span>{formatTime(news.publishedAt)}</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {news.summary}
                </p>
              </div>

              {/* 외부 링크 버튼 */}
              {news.url && news.url !== '#' && (
                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={() => window.open(news.url, '_blank', 'noopener,noreferrer')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>원문 보기</span>
                    <i className="ri-external-link-line"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}