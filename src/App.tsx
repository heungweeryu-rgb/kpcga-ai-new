import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

/**
 * 한국심리상담지도협회 (KPCGA) 공식 홈페이지 - 유흥위 회장님 전용 버전
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. 메인 슬라이드 데이터
  const slides = [
    {
      title: "마음의 평온을 찾는 여정",
      desc: "한국심리상담지도협회가 당신의 곁에서 함께하겠습니다.",
      color: "from-indigo-900 to-slate-900"
    },
    {
      title: "전문적인 심리 상담 가이드",
      desc: "국내 최고의 전문가들이 신뢰할 수 있는 지도를 제공합니다.",
      color: "from-teal-900 to-slate-900"
    },
    {
      title: "AI와 함께하는 정서적 지지",
      desc: "24시간 열려있는 따뜻한 상담 기술의 혁신.",
      color: "from-blue-900 to-slate-900"
    }
  ];

  // 슬라이드 자동 전환 (5초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 메뉴 리스트
  const menus = [
    { id: 'home', name: '홈' },
    { id: 'intro', name: '협회소개' },
    { id: 'history', name: '협회연혁' },
    { id: 'counsel', name: '상담안내' },
    { id: 'board', name: '자유게시판' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* --- 네비게이션바 --- */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-[100] border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">K</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-800 leading-none">KPCGA</span>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1">한국심리상담지도협회</span>
            </div>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-10">
            {menus.map(menu => (
              <button 
                key={menu.id}
                onClick={() => setActiveTab(menu.id)}
                className={`text-sm font-bold transition-all relative py-2 ${activeTab === menu.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {menu.name}
                {activeTab === menu.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />}
              </button>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* 모바일 사이드바 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-8 space-y-10 flex flex-col">
            <button onClick={() => setIsMenuOpen(false)} className="self-end p-2"><X size={32}/></button>
            <div className="flex flex-col gap-8">
              {menus.map((m) => (
                <button 
                  key={m.id} 
                  onClick={() => { setActiveTab(m.id); setIsMenuOpen(false); }} 
                  className={`text-2xl font-black text-left transition-colors ${activeTab === m.id ? 'text-indigo-600' : 'text-slate-400'}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="pt-20">
        {activeTab === 'home' && (
          <>
            {/* --- 메인 슬라이드 섹션 --- */}
            <section className="relative h-[550px] md:h-[750px] overflow-hidden bg-slate-900">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br ${slide.color} ${currentSlide === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
                >
                  <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight text-white drop-shadow-2xl">{slide.title}</h1>
                  <p className="text-lg md:text-2xl font-light text-slate-100 opacity-90 max-w-3xl mb-12 leading-relaxed">{slide.desc}</p>
                  <button onClick={() => setActiveTab('counsel')} className="group bg-white text-indigo-900 px-10 py-5 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-2xl flex items-center gap-3">
                    상담 서비스 바로가기 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
              
              {/* 슬라이드 컨트롤러 */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                {slides.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentSlide(i)} 
                    className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'bg-white w-12' : 'bg-white/30 w-3 hover:bg-white/50'}`} 
                  />
                ))}
              </div>
            </section>

            {/* --- 퀵 서비스 메뉴 --- */}
            <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-30 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: '협회 소개', icon: <BookOpen />, id: 'intro', color: 'text-blue-600' },
                { name: '심리 상담', icon: <MessageSquare />, id: 'counsel', color: 'text-indigo-600' },
                { name: '학술 연혁', icon: <Calendar />, id: 'history', color: 'text-teal-600' },
                { name: '공지 사항', icon: <Mail />, id: 'board', color: 'text-rose-600' }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTab(item.id)}
                  className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-5 border border-slate-50 hover:border-indigo-100 hover:-translate-y-2 transition-all group"
                >
                  <div className={`${item.color} group-hover:scale-110 transition-transform bg-slate-50 p-4 rounded-2xl`}>{item.icon}</div>
                  <span className="font-black text-slate-800 tracking-tight">{item.name}</span>
                </button>
              ))}
            </section>

            {/* --- 메인 뉴스 섹션 --- */}
            <section className="max-w-7xl mx-auto px-6 py-32">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">협회 소식</h2>
                  <p className="text-slate-500 text-lg">KPCGA의 새로운 걸음과 소식을 전해드립니다.</p>
                </div>
                <button onClick={() => setActiveTab('board')} className="text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform border-b-2 border-indigo-600/20 pb-1">
                  뉴스 더보기 <ChevronRight size={20}/>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { tag: '교육', title: '2026년 전문 심리상담사 1급 과정 모집', date: '2026.04.10' },
                  { tag: '행사', title: '봄맞이 비대면 마음 치유 캠페인 실시', date: '2026.04.05' },
                  { tag: '연구', title: 'AI 상담의 정서적 교감 효과에 대한 연구 보고', date: '2026.03.28' }
                ].map((post, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[4/3] bg-slate-100 rounded-[2rem] mb-6 overflow-hidden relative shadow-inner flex items-center justify-center text-slate-400">
                      [Image Placeholder]
                    </div>
                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{post.tag}</span>
                    <h4 className="text-xl font-bold mt-4 mb-3 group-hover:text-indigo-600 transition-colors leading-snug">{post.title}</h4>
                    <p className="text-slate-400 text-sm">{post.date}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* --- 협회장 인사말 섹션 --- */}
        {activeTab === 'intro' && (
          <section className="max-w-5xl mx-auto px-6 py-32">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-5xl font-black tracking-tight">협회장 인사말</h2>
              <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="w-full md:w-2/5 group relative">
                <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] -z-10 group-hover:rotate-3 transition-transform" />
                <div className="aspect-[3/4] bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white flex items-center justify-center text-slate-400">
                  [회장님 사진 영역]
                </div>
              </div>
              <div className="w-full md:w-3/5 space-y-10">
                <h3 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                  "마음의 문을 여는 <span className="text-indigo-600">따뜻한 지도</span>,<br /> 건강한 사회의 시작입니다."
                </h3>
                <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
                  <p>안녕하십니까. 한국심리상담지도협회 회장 <span className="text-slate-900 font-black underline decoration-indigo-500 decoration-4 underline-offset-4">유흥위</span>입니다.</p>
                  <p>현대 사회는 물질적 풍요 속에서도 마음의 고립과 정서적 결핍이라는 새로운 도전에 직면해 있습니다. 우리 협회는 이러한 시대적 아픔을 깊이 공감하며, 전문적인 상담 기술과 인간적인 온기를 결합하여 국민의 행복을 수호하고자 합니다.</p>
                  <p>우리는 단순히 지식을 전하는 것에 그치지 않고, 한 사람의 삶이 진정으로 치유되고 성장할 수 있도록 든든한 동반자가 되어드릴 것입니다. 특히 최신 AI 기술과 현장의 경험을 접목하여 누구에게나 열린 상담의 문턱을 만들어 가고 있습니다.</p>
                  <p>당신의 소중한 마음, 우리 협회가 따뜻하게 안아드리겠습니다.</p>
                </div>
                <div className="pt-10 border-t border-slate-100 flex flex-col items-end">
                  <p className="text-sm text-slate-400 mb-2 uppercase tracking-tighter">President of KPCGA</p>
                  <div className="flex items-center gap-6">
                    <p className="font-black text-slate-900 text-3xl">유 흥 위</p>
                    <div className="w-20 h-20 border-2 border-indigo-100 rounded-full flex items-center justify-center text-rose-500 font-serif text-xl border-dashed">직인</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- 협회 연혁 섹션 --- */}
        {activeTab === 'history' && (
          <section className="max-w-4xl mx-auto px-6 py-32">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-5xl font-black tracking-tight">협회 연혁</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest">Our History</p>
            </div>
            <div className="space-y-20 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-100">
              {[
                { year: '2026', title: 'AI 상담 솔루션 정식 가동', desc: '디지털 전환 시대에 맞춘 실시간 심리 분석 및 AI 스크리닝 시스템 구축' },
                { year: '2024', title: '전국 16개 지부 통합 운영', desc: '수도권을 비롯한 전국 주요 광역시도 전문 센터 연동 체계 마련' },
                { year: '2022', title: '심리상담 지도사 전문 자격 신설', desc: '실무 중심의 교육 과정 개편 및 공신력 있는 자격 인증제 도입' },
                { year: '2020', title: '한국심리상담지도협회 창립', desc: '국민 정신건강 증진과 상담 전문가 권익 보호를 목표로 발족' }
              ].map((item, i) => (
                <div key={i} className="flex gap-12 group">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 bg-white border-4 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-black shadow-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-lg font-black mb-4">{item.year}</div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- 상담 안내 섹션 --- */}
        {activeTab === 'counsel' && (
          <section className="max-w-6xl mx-auto px-6 py-32">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black tracking-tight mb-6">상담 서비스 안내</h2>
              <p className="text-slate-500 text-xl font-medium">마음의 짐을 함께 나눌 전문가들이 기다리고 있습니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: '개인 맞춤 상담', desc: '1:1 집중 대화를 통해 내면의 문제를 발견하고 자아를 회복하는 여정입니다.' },
                { title: '가족/관계 솔루션', desc: '부부, 부모-자녀 간의 갈등을 해소하고 소통의 기술을 전문적으로 코칭합니다.' },
                { title: '청소년 심리 지도', desc: '사춘기 갈등, 학업 스트레스, 진로 불안을 건강하게 극복하도록 돕습니다.' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 hover:border-indigo-300 hover:bg-white transition-all group shadow-sm hover:shadow-2xl">
                  <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white mb-10 shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-black mb-6 tracking-tight text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">{item.desc}</p>
                  <button className="text-indigo-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                    지금 예약하기 <ArrowRight size={20}/>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- 게시판 섹션 --- */}
        {activeTab === 'board' && (
          <section className="max-w-6xl mx-auto px-6 py-32">
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-4xl font-black tracking-tight">자유 게시판</h2>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl">글쓰기</button>
            </div>
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center w-24">NO</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-32">Author</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-32">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <tr key={i} className="hover:bg-slate-50/50 cursor-pointer transition-all group">
                      <td className="px-10 py-6 text-sm text-slate-400 text-center font-bold">{24 - i}</td>
                      <td className="px-10 py-6 text-slate-800 font-bold group-hover:text-indigo-600 text-lg">심리상담 지도사 자격 취득 문의드립니다. <span className="text-indigo-400 text-sm ml-2">[댓글 2]</span></td>
                      <td className="px-10 py-6 text-sm text-slate-500 font-medium">상담희망자</td>
                      <td className="px-10 py-6 text-sm text-slate-400">2026.04.02</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center mt-16 gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${i === 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{i}</button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* --- 푸터 섹션 --- */}
      <footer className="bg-slate-950 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 border-b border-white/5 pb-20 mb-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg">K</div>
              <span className="text-2xl font-black tracking-tighter">KPCGA</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed">한국심리상담지도협회는 모든 국민이 정서적 평안을 누리고 전문 상담사들이 역량을 발휘할 수 있는 환경을 만듭니다.</p>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-xl tracking-tight text-white/90">Contact Info</h5>
            <ul className="space-y-6 text-slate-400 text-lg">
              <li className="flex items-center gap-4 hover:text-indigo-400 transition-colors"><Phone size={22} className="text-indigo-500"/> 02-123-4567</li>
              <li className="flex items-center gap-4 hover:text-indigo-400 transition-colors"><Mail size={22} className="text-indigo-500"/> contact@kpcga.or.kr</li>
              <li className="flex items-center gap-4 hover:text-indigo-400 transition-colors leading-snug"><MapPin size={22} className="text-indigo-500 shrink-0"/> 서울특별시 강남구 테헤란로 협회빌딩 4F</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-xl tracking-tight text-white/90">Working Hours</h5>
            <div className="text-slate-400 text-lg space-y-2">
              <p>평일: 09:00 - 18:00</p>
              <p>점심시간: 12:00 - 13:00</p>
              <p className="text-indigo-400 font-bold">주말 및 공휴일 휴무</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 text-xs uppercase tracking-[0.4em] font-black mb-4">© 2026 KPCGA KOREA PSYCHOLOGY COUNSELING ASSOCIATION</p>
          <p className="text-slate-700 text-[10px] font-bold">Digital Solution Developed with Passion by Heung-wei Ryu</p>
        </div>
      </footer>
    </div>
  );
};

export default App;