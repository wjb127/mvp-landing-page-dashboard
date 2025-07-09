# SaaS 관리자 대시보드

Supabase 기반 SaaS 서비스의 관리자용 대시보드입니다. 사전예약 클릭과 이메일 등록 데이터를 시각화하여 보여줍니다.

## 주요 기능

- 서비스별 통계 요약 카드 (클릭 수, 사전예약 수, 마케팅 수신 동의 수, 전환율)
- 서비스별 막대 차트 (posture, reading, worktracker)
- 일별 추이 꺾은선 그래프 (최근 30일)
- 최근 사전예약자 테이블

## 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **Database**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## 설정 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env.local` 파일에 Supabase 정보를 입력하세요:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Supabase 테이블 생성
```sql
-- 버튼 클릭 이벤트 저장용
CREATE TABLE preorder_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  clicked_at TIMESTAMP DEFAULT now()
);

-- 이메일 + 마케팅 수신 동의 저장용
CREATE TABLE preorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  email TEXT NOT NULL,
  marketing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

4. 개발 서버 실행
```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── app/
│   └── page.tsx              # 메인 대시보드 페이지
├── components/
│   ├── StatsCard.tsx         # 통계 카드 컴포넌트
│   ├── ServiceBarChart.tsx   # 서비스별 막대 차트
│   ├── DailyTrendChart.tsx   # 일별 추이 꺾은선 그래프
│   └── RecentPreordersTable.tsx # 최근 사전예약자 테이블
├── hooks/
│   └── useAnalytics.ts       # 분석 데이터 훅
├── lib/
│   └── supabase.ts          # Supabase 클라이언트 설정
└── types/
    └── database.ts          # 데이터베이스 타입 정의
```

## 사용 방법

1. Supabase 프로젝트에서 위의 SQL로 테이블을 생성합니다.
2. 환경 변수를 설정합니다.
3. 개발 서버를 실행하여 대시보드에 접속합니다.
4. 실제 데이터가 없는 경우 테스트 데이터를 삽입해보세요:

```sql
-- 테스트 데이터 삽입
INSERT INTO preorder_clicks (service) VALUES 
  ('posture'), ('reading'), ('worktracker'),
  ('posture'), ('reading'), ('posture');

INSERT INTO preorders (service, email, marketing_opt_in) VALUES 
  ('posture', 'test1@example.com', true),
  ('reading', 'test2@example.com', false),
  ('worktracker', 'test3@example.com', true);
```

## 특징

- 반응형 디자인으로 모바일/데스크톱 모두 지원
- 실시간 데이터 새로고침 기능
- 깔끔하고 직관적인 관리자 UI
- TypeScript로 타입 안정성 확보
