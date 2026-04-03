import React, { useState, useEffect } from 'react';
import { 
  Menu, X, User, Calendar, BookOpen, MessageSquare, 
  Mail, Phone, MapPin, CheckCircle2, ArrowRight, 
  Settings, Send, Lock, Eye, Edit3, Heart, Users, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 한국심리상담지도협회 (KPCGA) - 유흥위 회장님 전용 최종 통합본
 * 디자인: 이전의 블랙&퍼플 테마 (image_99dfb1 등 참조)
 * 기능: 슬라이드, 솔루션 그리드, 상담신청, 실시간현황, 인사말, 연혁, 게시판
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. 메인 슬라이드 데이터
  const slides = [
    {
      title: "마음의 평온을 찾는 새로운 시작",
      desc: "한국심리상담지도협회는 전문적인 상담과 체계적인 교육을 통해 당신의 삶의 따뜻한 변화와 성장을 함께합니다.",
      bg: "bg-[#0a0c10]"
    },
    {
      title: "디지털 시대의 혁신적 심리 방역",
      desc: "AI 기술과 인간의 깊은 공감이 만나는 새로운 상담 패러다임을 제시합니다.",
      bg: "bg-[#0f172a]"
    }
  ];

  // 슬라이드 자동 전환
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const menus = [
    { id: 'home', name: '홈' },
    { id: 'intro', name: '협회소개' },
    { id: 'history', name: '협회연혁' },
    { id: 'counsel', name: '상담안내' },
    { id: 'board', name: '자유게시판' }
  ];

  // 2. 맞춤형 솔루션 데이터 (이미지 99dfb1 참조)
  const solutions = [
    { title: "개인 심리 상담", icon: <User size={24}/>, color: "text-purple-500", desc: "우울, 불안, 대인관계 등 개인의 내면을 치유하고 자아를 회복하는 맞춤 상담입니다." },
    { title: "부부 및 가족 상담", icon: <Heart size={24}/>, color: "text-rose-500", desc: "관계의 갈등을 해소하고 서로의 마음을 이해하며 소통하는 행복한 가정을 만듭니다." },
    { title: "청소년 상담", icon: <Sparkles size={24}/>, color: "text-teal-500", desc: "사춘기 갈등, 학업 스트레스 등 청소년기 고민을 함께 해결하고 미래를 설계합니다." },
    { title: "COUNSELOR 상담", icon: <Users size={24}/>, color: "text-blue-500", desc: "전문 상담사들의 역량 강화를 위한 수퍼비전과 전문적인 코칭을 제공합니다." },
    { title: "META 상담", icon: <MessageSquare size={24}/>, color: "text-indigo-500", desc: "메타버스 환경에서 익명성이 보장되는 자유롭고 편안한 새로운 형태의 상담입니다." },
    { title: "드론 마음 상담", icon: <Send size={24}/>, color: "text-orange-500", desc: "활동적인 매개체를 통해 마음의 벽을 허물고 정서적 이완을 돕는 혁신 프로그램입니다." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* --- 상단 네비게이션 --- */}
      <nav className="fixed top-0 w-full bg-[#0a0c10]/90 backdrop-blur-xl z-[100] border-b border-white/5 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">K</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">KPCGA</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">한국심리상담지도협회</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {menus.map(menu => (
              <button 
                key={menu.id}
                onClick={() => setActiveTab(menu.id)}
                className={`text-sm font-bold transition-all relative py-2 ${activeTab === menu.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {menu.name}
                {activeTab === menu.id && <motion.div layoutId="navline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />}
              </button>
            ))}
          </div>

          <button className="w-10 h-10 flex items-center justify-center text-slate-400 bg-white/5 rounded-xl border border-white/5"><Settings size={20}/></button>
        </div>
      </nav>

      <main className="pt-20">
        {activeTab === 'home' && (
          <div className="space-y-24 pb-32">
            {/* --- 메인 히어로 (슬라이드) --- */}
            <section className="relative h-[600px] md:h-[800px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 ${slides[currentSlide].bg}`}
                >
                  <div className="max-w-4xl">
                    <p className="text-indigo-500 font-black tracking-[0.3em] uppercase text-xs mb-6">Professional Psychological Services</p>
                    <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight drop-shadow-2xl">{slides[currentSlide].title}</h1>
                    <p className="text-lg md:text-xl font-light text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">{slides[currentSlide].desc}</p>
                    <div className="flex gap-4 justify-center">
                      <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">상담 예약하기</button>
                      <button className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all">교육안내 보기</button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all ${currentSlide === i ? 'bg-white w-12' : 'bg-white/20 w-4'}`} />
                ))}
              </div>
            </section>

            {/* --- 맞춤형 심리 솔루션 (이미지 99dfb1 재현) --- */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-black tracking-tight">맞춤형 심리 솔루션</h2>
                <p className="text-slate-500">당신에게 가장 필요한 전문 상담을 선택해보세요.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {solutions.map((item, i) => (
                  <div key={i} className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group relative overflow-hidden">
                    <div className={`${item.color} mb-8 transition-transform group-hover:scale-110`}>{item.icon}</div>
                    <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{item.desc}</p>
                    <button className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 group-hover:gap-4 transition-all">Detail View <ArrowRight size={14}/></button>
                  </div>
                ))}
              </div>
            </section>

            {/* --- 상담 신청란 (이미지 99dfb1 재현) --- */}
            <section className="max-w-5xl mx-auto px-6">
              <div className="bg-[#111827] rounded-[3rem] p-12 md:p-20 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 font-black text-9xl">INTAKE</div>
                <div className="relative z-10 text-center mb-16">
                  <h2 className="text-4xl font-black mb-4">상담 신청란</h2>
                  <p className="text-slate-400">도움이 필요하신가요? 아래 양식을 작성해 주시면 전문가가 연락드리겠습니다.</p>
                </div>
                <form className="space-y-8 max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">성함</label>
                      <input type="text" placeholder="성함을 입력해주세요" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">연락처</label>
                      <input type="text" placeholder="010-0000-0000" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">희망 상담 분야</label>
                    <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 outline-none appearance-none">
                      <option>개인 심리 상담</option>
                      <option>부부 및 가족 상담</option>
                      <option>청소년 상담</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">문의 내용</label>
                    <textarea placeholder="상담받고 싶은 내용을 간략히 적어주세요" rows={4} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="flex items-center gap-3 py-4">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600"/>
                    <span className="text-sm text-slate-400 font-medium">개인정보 수집 및 이용에 동의합니다.</span>
                  </div>
                  <button className="w-full bg-indigo-600 py-6 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">상담 신청하기</button>
                </form>
              </div>
            </section>

            {/* --- CURRENT STATUS (이미지 99e029 재현) --- */}
            <section className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black uppercase tracking-widest mb-2">Current Status</h2>
                <div className="w-12 h-1 bg-indigo-500 mx-auto rounded-full"></div>
              </div>
              <div className="bg-[#111827] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <th className="px-10 py-5">Status</th>
                      <th className="px-10 py-5">Content Summary</th>
                      <th className="px-10 py-5">Applicant</th>
                      <th className="px-10 py-5 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { status: '진행중', content: '사춘기 자녀와 공감적 대화법...', author: '유*', date: '12분 전' },
                      { status: '완료', content: '퇴사 결정 이후 무기력증 및 우울감 상담...', author: '김**', date: '1시간 전' },
                      { status: '접수중', content: '부부 관계 소통 부재에 대한 심층 상담...', author: '이*', date: '3시간 전' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${row.status === '완료' ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{row.status}</span>
                        </td>
                        <td className="px-10 py-6 text-sm font-bold group-hover:text-white transition-colors">{row.content}</td>
                        <td className="px-10 py-6 text-sm text-slate-500">{row.author}</td>
                        <td className="px-10 py-6 text-right"><Lock size={16} className="ml-auto text-slate-700"/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- 협회장 인사말 (추가 요청) --- */}
        {activeTab === 'intro' && (
          <section className="max-w-5xl mx-auto px-6 py-32">
            <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="w-full md:w-2/5 relative">
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-[3rem] blur-2xl" />
                <div className="aspect-[3/4] bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10 flex items-center justify-center text-slate-600">
                  <User size={64}/>
                </div>
              </div>
              <div className="w-full md:w-3/5 space-y-10">
                <h3 className="text-4xl md:text-5xl font-black leading-tight">
                  "마음의 문을 여는 <span className="text-indigo-500">따뜻한 지도</span>,<br /> 건강한 사회의 시작입니다."
                </h3>
                <div className="space-y-6 text-slate-400 leading-relaxed text-lg font-medium">
                  <p>안녕하십니까. 한국심리상담지도협회 회장 <span className="text-white font-black underline decoration-indigo-500 decoration-4 underline-offset-4">유흥위</span>입니다.</p>
                  <p>현대 사회는 물질적 풍요 속에서도 마음의 고립이라는 도전에 직면해 있습니다. 우리 협회는 이러한 시대적 아픔을 깊이 공감하며, 전문적인 상담 기술과 인간적인 온기를 결합하여 국민의 행복을 수호하고자 설립되었습니다.</p>
                  <p>당신의 소중한 마음, 우리 협회가 따뜻하게 안아드리겠습니다.</p>
                </div>
                <div className="pt-10 border-t border-white/5 flex flex-col items-end">
                  <p className="font-black text-3xl">유 흥 위</p>
                  <p className="text-sm text-slate-500 mt-2 uppercase tracking-widest">President of KPCGA</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- 협회 연혁 (추가 요청) --- */}
        {activeTab === 'history' && (
          <section className="max-w-4xl mx-auto px-6 py-32">
            <h2 className="text-5xl font-black mb-24 text-center">협회 연혁</h2>
            <div className="space-y-20 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-1 before:bg-white/5">
              {[
                { year: '2026', title: 'AI 상담 솔루션 정식 가동', desc: '실시간 심리 분석 및 AI 스크리닝 시스템 구축 완료' },
                { year: '2024', title: '전국 16개 지부 통합 운영', desc: '광역시도 전문 센터 연동 체계 마련' },
                { year: '2022', title: '심리상담 지도사 전문 자격 신설', desc: '실무 중심 교육 과정 개편 및 인증제 도입' },
                { year: '2020', title: '한국심리상담지도협회 창립', desc: '국민 정신건강 증진을 목표로 발족' }
              ].map((item, i) => (
                <div key={i} className="flex gap-12 group">
                  <div className="w-12 h-12 bg-slate-900 border-4 border-indigo-500 rounded-full flex items-center justify-center text-indigo-500 font-black z-10 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">{i+1}</div>
                  <div>
                    <span className="bg-indigo-500/10 text-indigo-400 px-4 py-1 rounded-full text-lg font-black mb-4 inline-block">{item.year}</span>
                    <h4 className="text-2xl font-black mb-3">{item.title}</h4>
                    <p className="text-slate-500 text-lg font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* --- 푸터 섹션 --- */}
      <footer className="bg-black pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 border-b border-white/5 pb-20 mb-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black">K</div>
              <span className="text-2xl font-black tracking-tighter">KPCGA</span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed">국민의 마음 건강을 지키는 든든한 동반자, 한국심리상담지도협회가 함께합니다.</p>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-xl">Contact</h5>
            <ul className="space-y-6 text-slate-400 text-lg">
              <li className="flex items-center gap-4"><Phone size={22} className="text-indigo-500"/> 02-123-4567</li>
              <li className="flex items-center gap-4"><Mail size={22} className="text-indigo-500"/> contact@kpcga.or.kr</li>
              <li className="flex items-center gap-4"><MapPin size={22} className="text-indigo-500"/> 서울특별시 강남구 협회빌딩 4F</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-xl">Working Hours</h5>
            <div className="text-slate-500 text-lg space-y-2">
              <p>평일: 09:00 - 18:00</p>
              <p className="text-indigo-500 font-bold italic">주말 및 공휴일 휴무</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-700 text-xs uppercase tracking-[0.4em] font-black">© 2026 KPCGA KOREA PSYCHOLOGY COUNSELING ASSOCIATION</p>
          <p className="text-slate-800 text-[10px] mt-4 font-bold">Digital Infrastructure Solution by Heung-wei Ryu</p>
        </div>
      </footer>
    </div>
  );
};

export default App;