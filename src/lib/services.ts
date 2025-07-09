export interface ServiceConfig {
  value: string
  label: string
  color: string
  description?: string
}

export const SERVICES: ServiceConfig[] = [
  { 
    value: 'PosturAI', 
    label: '자세 교정', 
    color: 'bg-blue-500',
    description: '올바른 자세 유지를 위한 AI 솔루션'
  },
  { 
    value: 'reading', 
    label: '독해 훈련', 
    color: 'bg-green-500',
    description: 'AI 기반 맞춤형 영어 독해 학습'
  },
  { 
    value: 'worktracker', 
    label: '업무 트래커', 
    color: 'bg-purple-500',
    description: '효율적인 업무 시간 관리 도구'
  }
  // 새로운 서비스는 여기에 추가하면 됩니다
  // { 
  //   value: 'new-service', 
  //   label: '새 서비스', 
  //   color: 'bg-orange-500',
  //   description: '새로운 서비스 설명'
  // }
]

export const ALL_SERVICES_OPTION = {
  value: 'all',
  label: '전체 서비스',
  color: 'bg-gray-500',
  description: '모든 서비스 통합 데이터'
}

export const getServiceDisplayName = (serviceValue: string): string => {
  if (serviceValue === 'all') return ALL_SERVICES_OPTION.label
  const service = SERVICES.find(s => s.value === serviceValue)
  return service?.label || serviceValue
}

export const getServiceColor = (serviceValue: string): string => {
  if (serviceValue === 'all') return ALL_SERVICES_OPTION.color
  const service = SERVICES.find(s => s.value === serviceValue)
  return service?.color || 'bg-gray-400'
}

export const getAllServiceOptions = () => [ALL_SERVICES_OPTION, ...SERVICES] 