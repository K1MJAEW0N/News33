
interface TimeFilterProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

export default function TimeFilter({ selectedTime, onTimeChange }: TimeFilterProps) {
  const timeOptions = [
    { value: 'all', label: '전체' },
    { value: '1h', label: '1시간' },
    { value: '6h', label: '6시간' },
    { value: '12h', label: '12시간' },
    { value: '24h', label: '24시간' },
    { value: '7d', label: '7일' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {timeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onTimeChange(option.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            selectedTime === option.value
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
