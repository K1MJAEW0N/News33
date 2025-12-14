// src/services/newsApi.ts
// Vite 프록시를 통해 실제 API 호출
export interface FetchNewsOptions {
  numOfRows?: number;
  pageNo?: number;
  returnType?: 'json' | 'xml';
  inqDt?: string; // YYYYMMDD
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  sentiment?: string;
  publishedAt: string; // ISO string
  source: string;
  imageUrl?: string;
  url?: string;
}

export interface FetchNewsResult {
  items: NewsItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}

function classifyCategory(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  const includesAny = (words: string[]) => words.some(w => text.includes(w));

  // 정치
  if (includesAny(['국회','정부','정책','대통령','장관','총리','청와대','국정','선거','정당'])) return '정치';
  // 사회
  if (includesAny(['사고','화재','사망','재해','사건','범죄','경찰','소방','구조','지진','침수','붕괴'])) return '사회';
  // 경제
  if (includesAny(['금리','주가','증시','환율','GDP','물가','부동산','수출','수입','기업','채권'])) return '경제';
  // 국제
  if (includesAny(['미국','중국','일본','러시아','EU','우크라이나','국제','외교'])) return '국제';
  // 문화
  if (includesAny(['전시','공연','예술','영화','드라마','축제','박물관','문화'])) return '문화';
  // 스포츠
  if (includesAny(['축구','야구','농구','배구','골프','올림픽','월드컵','스포츠'])) return '스포츠';
  // 과학기술
  if (includesAny(['AI','인공지능','로봇','반도체','우주','과학','기술','IT','소프트웨어'])) return '과학기술';
  // 교육
  if (includesAny(['학교','대학','교육','교사','학생','입시'])) return '교육';

  return '전체';
}

function parseDateFromYYYYMMDD(yyyymmdd?: string, fallback?: string) {
  if (!yyyymmdd) return fallback ?? new Date().toISOString();
  
  try {
    // "2024-01-28" 또는 "2024-01-28 09:23:31" 형식 모두 처리
    const datePart = yyyymmdd.split(' ')[0]; // "2024-01-28" 추출
    if (datePart.includes('-')) {
      // "2024-01-28" 형식
      return new Date(datePart + 'T00:00:00Z').toISOString();
    } else if (datePart.length === 8) {
      // "20240128" 형식
      const y = datePart.slice(0, 4);
      const m = datePart.slice(4, 6);
      const d = datePart.slice(6, 8);
      return new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString();
    }
  } catch {
    return fallback ?? new Date().toISOString();
  }
  
  return fallback ?? new Date().toISOString();
}

export async function fetchNews(opts: FetchNewsOptions = {}): Promise<FetchNewsResult> {
  const {
    numOfRows = 20,
    pageNo = 1,
    returnType = 'json',
    inqDt
  } = opts;

  const params = new URLSearchParams({
    serviceKey: '3F5CB589V3R1J75P',
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
    returnType: returnType
  });
  if (inqDt) params.set('inqDt', inqDt);

  // Vite 프록시를 통해 실제 API 호출
  const url = `/V2/api/DSSP-IF-00051?${params.toString()}`;
  
  console.log('API 요청 URL:', url);
  console.log('전체 파라미터:', params.toString());


  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  console.log('응답 상태:', res.status, res.statusText);
  console.log('응답 헤더 Content-Type:', res.headers.get('content-type'));

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('API 오류 응답:', {
      status: res.status,
      statusText: res.statusText,
      body: text,
      url: url
    });
    throw new Error(`API 요청 실패: ${res.status} ${res.statusText} - ${text}`);
  }

  // JSON 응답 처리
  const contentType = res.headers.get('content-type') ?? '';
  let data: any = null;
  
  // 응답 텍스트 먼저 가져오기
  const responseText = await res.text();
  console.log('응답 원본 텍스트 전체:', responseText);
  console.log('응답 텍스트 길이:', responseText.length);
  
  if (contentType.includes('application/json') || responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('JSON 파싱 실패:', e);
      data = null;
    }
  } else if (contentType.includes('xml') || responseText.trim().startsWith('<')) {
    console.log('XML 응답 감지됨. JSON으로 변환 시도...');
    // XML을 JSON으로 변환하는 간단한 시도
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('XML 파싱은 지원되지 않습니다. returnType=json을 확인하세요.');
      data = null;
    }
  } else {
    try { 
      data = JSON.parse(responseText); 
    } catch { 
      console.error('알 수 없는 응답 형식:', responseText);
      data = null; 
    }
  }

  console.log('API 응답 데이터:', data);
  console.log('응답 구조:', JSON.stringify(data, null, 2));

  // 응답에서 items 배열 찾기
  let items: any[] = [];
  if (!data) {
    items = [];
    console.log('데이터가 없습니다');
  }
  // 이 API는 body 배열에 데이터가 직접 있음
  else if (Array.isArray(data?.body)) {
    items = data.body;
    console.log('body 배열 형식 감지:', items.length, '개');
  }
  else if (data?.response?.body?.items?.item) {
    items = data.response.body.items.item;
    console.log('공공데이터 표준 형식 감지:', items);
  }
  else if (data?.data) {
    items = Array.isArray(data.data) ? data.data : [data.data];
    console.log('data 필드 감지:', items);
  }
  else if (data?.items) {
    items = data.items;
    console.log('items 필드 감지:', items);
  }
  else if (Array.isArray(data)) {
    items = data;
    console.log('배열 형식 감지:', items);
  }
  else if (data?.response?.body?.items) {
    const it = data.response.body.items;
    if (Array.isArray(it)) items = it;
    else if (it?.item) items = Array.isArray(it.item) ? it.item : [it.item];
    console.log('items 중첩 구조 감지:', items);
  }
  
  console.log('최종 파싱된 items 개수:', items.length);

  console.log('최종 파싱된 items 개수:', items.length);

  // API 응답을 NewsItem으로 매핑
  const mapped: NewsItem[] = (items || []).map((it: any, idx: number) => {
    const id = it.YNA_NO ?? it.id ?? (`api-${idx}-${Math.random().toString(36).slice(2,8)}`);
    const title = it.YNA_NM ?? it.YNA_TTL ?? it.title ?? '제목 없음';
    const summary = it.YNA_CN ?? it.summary ?? it.content ?? '내용 없음';
    
    // YNA_YMD와 CRT_DT 모두 사용 가능
    const dateStr = it.YNA_YMD ?? it.CRT_DT ?? new Date().toISOString();
    const publishedAt = parseDateFromYYYYMMDD(dateStr);
    
    const source = it.YNA_WRTR_NM ?? it.source ?? '안전보건공단';
    const category = classifyCategory(title, summary);
    return {
      id: String(id),
      title,
      summary,
      category,
      sentiment: '전체',
      publishedAt,
      source,
      imageUrl: it.imageUrl,
      url: it.url || '#'
    };
  });

  console.log('최종 매핑된 뉴스 개수:', mapped.length);
  const totalCount = typeof (data?.totalCount) === 'number' ? data.totalCount : Number(data?.totalCount ?? mapped.length);
  return {
    items: mapped,
    totalCount,
    pageNo,
    numOfRows
  };
}