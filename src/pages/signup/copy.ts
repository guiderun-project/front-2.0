// 회원가입 단계별 문구
export const SIGNUP_COPY = {
  runnerType: {
    title: '어떤 러너로\n참여하시나요?',
    info: {
      title: '가이드러너란?',
      body: '시각장애 러너와 함께 호흡을 맞춰 달리며,\n길 안내와 안전을 돕는 러너예요.',
    },
  },
  gender: { title: '성별을\n선택해주세요' },
  basicInfo: { title: '기본 정보를\n입력해주세요' },
  experience: { title: '러닝 경험이\n있으신가요?' },
  record: { title: '러닝 경험을\n알려주세요' },
  terms: { title: '마지막으로,\n가입을 위해 약관에 동의해주세요' },
  complete: {
    title: '가입을 완료했어요!',
    body: '서로 믿고 달릴 수 있는 환경을 위해\n가입 정보를 확인하고 있어요.',
    highlight: '하루 이내에 카카오톡으로 안내드릴게요!',
  },
} as const;
