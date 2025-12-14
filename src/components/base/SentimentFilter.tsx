
import { useState } from 'react';

interface SentimentFilterProps {
  selectedSentiment: string;
  onSentimentChange: (sentiment: string) => void;
  sentimentOptions: string[];
}

export default function SentimentFilter({ 
  selectedSentiment, 
  onSentimentChange, 
  sentimentOptions 
}: SentimentFilterProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case '긍정':
        return 'ri-emotion-happy-line';
      case '중립':
        return 'ri-emotion-normal-line';
      case '부정':
        return 'ri-emotion-unhappy-line';
      default:
        return 'ri-emotion-line';
    }
  };

  const getSentimentColor = (sentiment: string, isSelected: boolean) => {
    if (!isSelected) return 'text-gray-600 hover:text-gray-800';
    
    switch (sentiment) {
      case '긍정':
        return 'text-green-600 bg-green-50 border-green-200';
      case '중립':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case '부정':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-gray-700 flex items-center mr-2">
        <i className="ri-emotion-line mr-1"></i>
        감정 분석:
      </span>
      {sentimentOptions.map((sentiment) => {
        const isSelected = selectedSentiment === sentiment;
        return (
          <button
            key={sentiment}
            onClick={() => onSentimentChange(sentiment)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 
              whitespace-nowrap cursor-pointer flex items-center gap-1
              ${isSelected 
                ? getSentimentColor(sentiment, true)
                : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }
            `}
          >
            <i className={`${getSentimentIcon(sentiment)} text-sm`}></i>
            {sentiment}
          </button>
        );
      })}
    </div>
  );
}
