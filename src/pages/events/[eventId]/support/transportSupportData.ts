type TransportContact = {
  number: string;
  desc?: string;
};

type KtxContact = {
  name: string;
  number: string;
};

export type TransportSupportRegion = {
  id: string;
  name: string;
  mobilityCenter: {
    name: string;
    contacts: TransportContact[];
  };
  ktx: KtxContact[];
};

export const TRANSPORT_SUPPORT_DATA: TransportSupportRegion[] = [
  {
    id: 'gangwon',
    name: '강원',
    mobilityCenter: {
      name: '강원도 교통약자 광역이동지원센터(봄내콜)',
      contacts: [{ number: '1577-2014' }],
    },
    ktx: [
      { name: '춘천역', number: '033-241-7758' },
      { name: '남춘천역', number: '033-257-7022' },
    ],
  },
  {
    id: 'gyeonggi',
    name: '경기',
    mobilityCenter: {
      name: '경기도 광역이동 지원센터',
      contacts: [{ number: '1666-0420' }],
    },
    ktx: [
      { name: '광명역', number: '02-899-9270' },
      { name: '동탄역', number: '031-328-5505' },
    ],
  },
  {
    id: 'gyeongnam',
    name: '경남',
    mobilityCenter: {
      name: '경상남도 광역이동지원센터',
      contacts: [{ number: '1566-4488' }],
    },
    ktx: [{ name: '창원역', number: '055-292-7788' }],
  },
  {
    id: 'gyeongbuk',
    name: '경북',
    mobilityCenter: {
      name: '경북 광역이동지원센터 (부름콜)',
      contacts: [{ number: '1899-7770' }],
    },
    ktx: [
      { name: '경주역', number: '054-613-8010' },
      { name: '김천(구미)역', number: '054-437-2752' },
    ],
  },
  {
    id: 'gwangju',
    name: '광주',
    mobilityCenter: {
      name: '광주광역시교통약자이동지원센터 (새빛콜)',
      contacts: [{ number: '1668-2222' }],
    },
    ktx: [{ name: '광주송정역', number: '062-941-3178' }],
  },
  {
    id: 'daegu',
    name: '대구',
    mobilityCenter: {
      name: '대구 나드리콜',
      contacts: [{ number: '1544-6776' }],
    },
    ktx: [{ name: '동대구역', number: '053-940-2222' }],
  },
  {
    id: 'daejeon',
    name: '대전',
    mobilityCenter: {
      name: '대전교통약자이동지원센터',
      contacts: [
        { number: '042-612-1050', desc: '가입문의' },
        { number: '042-612-1010', desc: '차량접수' },
      ],
    },
    ktx: [
      { name: '대전역', number: '042-259-2416' },
      { name: '서대전역', number: '042-259-2275' },
    ],
  },
  {
    id: 'busan',
    name: '부산',
    mobilityCenter: {
      name: '두리발',
      contacts: [{ number: '1555-1114' }],
    },
    ktx: [{ name: '부산역', number: '051-440-2520' }],
  },
  {
    id: 'seoul',
    name: '서울',
    mobilityCenter: {
      name: '복지콜',
      contacts: [{ number: '02-2092-0000' }],
    },
    ktx: [
      { name: '서울역', number: '02-3149-2518' },
      { name: '수서역', number: '02-2177-8246' },
      { name: '용산역', number: '02-798-4508' },
    ],
  },
  {
    id: 'sejong',
    name: '세종',
    mobilityCenter: {
      name: '세종도시교통공사 누리콜',
      contacts: [{ number: '1899-9042' }],
    },
    ktx: [],
  },
  {
    id: 'ulsan',
    name: '울산',
    mobilityCenter: {
      name: '교통약자 이동 지원센터',
      contacts: [{ number: '052-292-8253' }],
    },
    ktx: [{ name: '울산역', number: '052-254-7787' }],
  },
  {
    id: 'incheon',
    name: '인천',
    mobilityCenter: {
      name: '교통약자 지원',
      contacts: [{ number: '1577-0320' }],
    },
    ktx: [],
  },
  {
    id: 'jeonnam',
    name: '전남',
    mobilityCenter: {
      name: '전라남도 광역이동지원센터',
      contacts: [
        { number: '1899-1110' },
        { number: '061-287-8341', desc: '이용등록' },
      ],
    },
    ktx: [
      { name: '목포역', number: '061-242-0510' },
      { name: '순천역', number: '061-749-2288' },
      { name: '여수엑스포역', number: '061-749-2604' },
    ],
  },
  {
    id: 'jeonbuk',
    name: '전북',
    mobilityCenter: {
      name: '전북특별자치도광역이동지원센터',
      contacts: [{ number: '063-227-0002' }],
    },
    ktx: [
      { name: '김제역', number: '063-700-5201' },
      { name: '전주역', number: '063-243-7788' },
      { name: '익산역', number: '063-855-7786' },
    ],
  },
  {
    id: 'jeju',
    name: '제주',
    mobilityCenter: {
      name: '제주콜',
      contacts: [{ number: '1899-6884' }],
    },
    ktx: [],
  },
  {
    id: 'chungnam',
    name: '충남',
    mobilityCenter: {
      name: '충청남도 광역이동지원센터',
      contacts: [{ number: '1644-5588' }],
    },
    ktx: [
      { name: '공주역', number: '041-400-4104' },
      { name: '천안아산역', number: '041-549-6788' },
    ],
  },
  {
    id: 'chungbuk',
    name: '충북',
    mobilityCenter: {
      name: '충청북도 광역이동지원센터',
      contacts: [{ number: '1533-0220' }],
    },
    ktx: [{ name: '오송역', number: '043-231-4542' }],
  },
];
