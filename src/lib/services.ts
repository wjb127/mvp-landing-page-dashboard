export interface ServiceConfig {
  value: string
  label: string
  color: string
  description?: string
}

// 서비스 이름을 보기 좋은 라벨로 변환하는 매핑
const SERVICE_DISPLAY_NAMES: { [key: string]: string } = {
  'PosturAI': '자세 교정',
  'reading': '독해 훈련',
  'worktracker': '업무 트래커'
}

// 서비스별 색상 매핑
const SERVICE_COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-cyan-500'
]

export const ALL_SERVICES_OPTION = {
  value: 'all',
  label: '전체 서비스',
  color: 'bg-gray-500',
  description: '모든 서비스 통합 데이터'
}

export const getServiceDisplayName = (serviceValue: string): string => {
  if (serviceValue === 'all') return ALL_SERVICES_OPTION.label
  return SERVICE_DISPLAY_NAMES[serviceValue] || serviceValue
}

export const getServiceColor = (serviceValue: string, index?: number): string => {
  if (serviceValue === 'all') return ALL_SERVICES_OPTION.color
  
  // 인덱스가 있으면 해당 인덱스의 색상 사용, 없으면 기본 색상
  if (typeof index === 'number') {
    return SERVICE_COLORS[index % SERVICE_COLORS.length]
  }
  
  return 'bg-gray-400'
}

export const createServiceConfig = (services: string[]): ServiceConfig[] => {
  return services.map((service, index) => ({
    value: service,
    label: getServiceDisplayName(service),
    color: getServiceColor(service, index),
    description: `${getServiceDisplayName(service)} 서비스`
  }))
}

export const getAllServiceOptions = (availableServices: string[]) => [
  ALL_SERVICES_OPTION, 
  ...createServiceConfig(availableServices)
] 