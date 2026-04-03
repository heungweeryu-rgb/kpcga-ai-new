import React, { useState, useEffect } from 'react';
import { 
  Menu, X, User, Calendar, BookOpen, MessageSquare, 
  Mail, Phone, MapPin, CheckCircle2, ArrowRight, 
  Settings, Send, Lock, Eye, Edit3, Heart, Users, Sparkles,
  Target, Award, ShieldCheck, Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * KPCGA 한국심리상담지도협회 - 최종 완성 보완본
 * 1. PDF 데이터(설립목적, 사업, 조직, 상세연혁) 반영
 * 2. 협회장 인사말 내 성함 제거
 * 3. 첫 화면 메인 슬라이드 쇼 (자동 전환) 적용
 * 4. 블랙 & 퍼플 디자인 아이덴티티 유지
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. 메인 슬라이드 데이터 (이미지 9a423f 등 참고)
  const slides = [
    {
      title: "마음의 평온을 찾는 새로운 시작",
      desc: "한국심리상담지도협회는 전문적인 상담과 체계적인 교육을 통해 당신의 삶의 따뜻한 변화를 함께합니다.",
      bg: "bg-gradient-to-br from-indigo-900/40 to-[#0a0c10]",
      tag: "Professional Support"
    },
    {
      title: "현장 접근적 전문 인력 양성",
      desc: "2007년부터 이어져 온 독창성과 현장성이 결집된 실용적 기법으로 국내 최고의 상담 전문가를 육성합니다.",
      bg: "bg-gradient-to-br from-purple-900/40 to-[#0a0c10]",
      tag: "Expert Education"
    },
    {
      title: "24시간 열려있는 디지털 심리 방역",
      desc: "최신 AI 기술과 인간의 깊은 공감이 만나 더 넓고 깊은 정서적 지지 솔루션을 제공합니다.",
      bg: "bg-gradient-to-br from-teal-900/40 to-[#0a0c10]",
      tag: "Digital Innovation"
    }
  ];

  // 슬라이드 자동 전환 (３초마다)
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const menus = [
    { id: 'home', name: '홈' },
    { id: 'intro', name: '협회소개' },
    { id: 'history', name: '협회연혁' },
    { id: 'counsel', name: '상담안내' },
    { id: 'board', name: '자유게시판' }
  ];

  // 2. 맞춤형 솔루션 데이터 (이미지 99dfb1 스타일)
  const solutions = [
    { title: "개인 심리 상담", icon: <User size={24}/>, color: "text-purple-500", desc: "우울, 불안 등 개인의 내면을 치유하고 자아를 회복하는 맞춤 상담입니다." },
    { title: "부부 및 가족 상담", icon: <Heart size={24}/>, color: "text-rose-500", desc: "관계 갈등을 해소하고 서로를 이해하며 소통하는 행복한 가정을 만듭니다." },
    { title: "청소년 상담", icon: <Sparkles size={24}/>, color: "text-teal-500", desc: "사춘기 갈등, 학업 스트레스를 함께 해결하고 건강한 성장을 돕습니다." },
    { title: "COUNSELOR 상담", icon: <Users size={24}/>, color: "text-blue-500", desc: "전문 상담사들의 역량 강화를 위한 수퍼비전과 코칭을 제공합니다." },
    { title: "META 상담", icon: <MessageSquare size={24}/>, color: "text-indigo-500", desc: "메타버스 환경에서 익명성이 보장되는 자유롭고 편안한 상담입니다." },
    { title: "드론 마음 상담", icon: <Send size={24}/>, color: "text-orange-500", desc: "활동적 매개체를 통해 마음의 벽을 허무는 혁신 프로그램입니다." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* --- 네비게이션 --- */}
      <nav className="fixed top-0 w-full bg-[#0a0c10]/90 backdrop-blur-xl z-[100] border-b border-white/5 h-20 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
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
            {/* --- 메인 히어로 슬라이드 쇼 --- */}
            <section className="relative h-[650px] md:h-[800px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 ${slides[currentSlide].bg}`}
                >
                  <div className="max-w-4xl relative z-10">
                    <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.2}} className="flex items-center justify-center gap-2 mb-6">
                      <div className="w-8 h-px bg-indigo-500"></div>
                      <p className="text-indigo-400 font-black tracking-[0.4em] uppercase text-[10px]">{slides[currentSlide].tag}</p>
                      <div className="w-8 h-px bg-indigo-500"></div>
                    </motion.div>
                    <motion.h1 initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.4}} className="text-4xl md:text-7xl font-black mb-8 leading-tight drop-shadow-2xl">{slides[currentSlide].title}</motion.h1>
                    <motion.p initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.6}} className="text-lg md:text-xl font-light text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">{slides[currentSlide].desc}</motion.p>
                    <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.8}} className="flex gap-4 justify-center">
                      <button onClick={() => setActiveTab('counsel')} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">상담 신청하기</button>
                      <button onClick={() => setActiveTab('intro')} className="bg-white/5 border border-white/10 px-12 py-5 rounded-2xl font-black hover:bg-white/10 transition-all active:scale-95">협회소개</button>
                    </div>
                  </div>
                  {/* 배경 글로우 효과 */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-600/10 rounded-full blur-[140px] -z-0" />
                </motion.div>
              </AnimatePresence>
              
              {/* 슬라이드 인디케이터 */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'bg-indigo-500 w-16' : 'bg-white/20 w-4'}`} />
                ))}
              </div>
            </section>

            {/* --- 맞춤형 솔루션 그리드 --- */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20 space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-white">맞춤형 심리 솔루션</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">한국심리상담지도협회는 현장성 있는 실용적 기법을 통해 개인과 가정, 사회의 정서적 건강을 지원합니다.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {solutions.map((item, i) => (
                  <motion.div whileHover={{ y: -10 }} key={i} className="bg-slate-900/40 p-12 rounded-[3rem] border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group relative overflow-hidden shadow-2xl">
                    <div className={`${item.color} mb-8 transition-transform group-hover:scale-110 p-5 bg-white/5 w-fit rounded-[1.5rem]`}>{item.icon}</div>
                    <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">{item.desc}</p>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-3 group-hover:gap-5 transition-all">상세보기 <ArrowRight size={14}/></button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* --- 실시간 상담 현황 --- */}
            <section className="max-w-6xl mx-auto px-6">
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Current Status</h2>
                  <div className="w-12 h-1.5 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Updates</span>
                </div>
              </div>
              <div className="bg-[#0f1115] rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      <th className="px-10 py-7">상태</th>
                      <th className="px-10 py-7">상담 내용 요약</th>
                      <th className="px-10 py-7">신청자</th>
                      <th className="px-10 py-7 text-right">보안</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { status: '진행중', content: '사춘기 자녀와 공감적 대화법 코칭 요청 및 해결방안...', author: '이*', date: '12분 전' },
                      { status: '완료', content: '직장 내 번아웃 극복을 위한 자아 회복 상담 사례...', author: '박**', date: '1시간 전' },
                      { status: '접수중', content: '부부 갈등 해소 및 정서적 교감을 위한 솔루션 신청...', author: '최*', date: '3시간 전' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-all group">
                        <td className="px-10 py-8">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${row.status === '완료' ? 'bg-green-500/10 text-green-400' : 'bg-indigo-500/10 text-indigo-400'}`}>{row.status}</span>
                        </td>
                        <td className="px-10 py-8 text-sm font-bold group-hover:text-white transition-colors text-slate-300">{row.content}</td>
                        <td className="px-10 py-8 text-sm text-slate-500 font-medium">{row.author}</td>
                        <td className="px-10 py-8 text-right"><Lock size={16} className="ml-auto text-slate-800 group-hover:text-indigo-900 transition-colors"/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- 협회소개 (PDF 데이터 완벽 반영) --- */}
        {activeTab === 'intro' && (
          <div className="max-w-5xl mx-auto px-6 py-24 space-y-32">
            {/* 1. 협회장 인사말 (성함 제거) */}
            <section className="flex flex-col md:flex-row gap-20 items-center">
              <div className="w-full md:w-2/5 relative">
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-[3rem] blur-[80px] opacity-40" />
                <div className="aspect-[3/4] bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl relative border border-white/10 flex items-center justify-center text-slate-800">
                  <User size={140} strokeWidth={0.3}/>
                  <div className="absolute bottom-10 bg-[#0a0c10]/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/5">
                    <p className="text-indigo-400 font-black text-sm uppercase tracking-widest text-center">Presidential Greeting</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/5 space-y-10">
                <h3 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tight">
                  "여러분의 풍부한 경험과<br /> 전문지식을 결합하여<br /> <span className="text-indigo-500">도약의 기회</span>를 만듭니다."
                </h3>
                <div className="space-y-6 text-slate-400 leading-relaxed text-lg font-medium">
                  <p>안녕하십니까. 한국심리상담지도협회가 시작되어 짧지 않은 시간이 지났습니다.</p>
                  <p>2007년 3월 창립총회를 연 것이 엊그제 같은데, 이제는 1,900여 명의 회원과 전문 인력을 보유한 심리상담 전문가 단체로 당당히 발전하였습니다.</p>
                  <p>우리 협회의 심리상담 프로그램은 독창성과 현장성이 결집된 실용적 기법이 폭넓게 적용되어 각계각층에서 다양하게 활용되고 있습니다. 앞으로도 이론과 실무를 병행하며 내실을 다져 당신의 소중한 마음을 따뜻하게 안아드리겠습니다.</p>
                </div>
                <div className="pt-10 border-t border-white/10 flex flex-col items-end">
                  <p className="font-black text-2xl text-white">한국심리상담지도협회장</p>
                  <p className="text-xs text-slate-500 mt-3 uppercase tracking-[0.4em] font-bold">Korea Psychology Counseling Association</p>
                </div>
              </div>
            </section>

            {/* 2. 설립목적 및 주요사업 (PDF 1~2페이지) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-[#0f1115] p-16 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20"><Target size={36}/></div>
                <h4 className="text-3xl font-black text-white">설립 목적</h4>
                <ul className="space-y-6 text-slate-400">
                  <li className="flex gap-4 items-start"><CheckCircle2 className="text-indigo-500 shrink-0 mt-1" size={22}/> <span>현장성 있는 심리상담 기법 개발·보급 및 치료적 상담모형 정립</span></li>
                  <li className="flex gap-4 items-start"><CheckCircle2 className="text-indigo-500 shrink-0 mt-1" size={22}/> <span>실용적 상담기법 개발 활용 및 정서적 갈등 해소 지원</span></li>
                  <li className="flex gap-4 items-start"><CheckCircle2 className="text-indigo-500 shrink-0 mt-1" size={22}/> <span>이론과 실무가 접목된 현장접근적 전문 인력 양성</span></li>
                </ul>
              </div>
              <div className="bg-[#0f1115] p-16 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl">
                <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-teal-600/20"><BookOpen size={36}/></div>
                <h4 className="text-3xl font-black text-white">주요 사업</h4>
                <ul className="space-y-5 text-slate-400 text-sm font-medium">
                  <li className="flex gap-3"><span>• 심리상담 실무자 자질 및 실무능력 향상 연수</span></li>
                  <li className="flex gap-3"><span>• 심리상담 관련 도서 및 프로그램 개발·보급</span></li>
                  <li className="flex gap-3"><span>• 심리상담 관련 학술·실무 단체와 교류 및 협력</span></li>
                  <li className="flex gap-3"><span>• 이사회 선정 상담심리 관련 연구 및 개발 사업</span></li>
                </ul>
              </div>
            </section>

            {/* 3. 조직 구성 (PDF 2페이지) */}
            <section className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-16 rounded-[4rem] border border-white/10 text-center space-y-10">
              <h4 className="text-3xl font-black text-white">조직 및 회원 현황</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Executives</p>
                  <p className="text-3xl font-black text-white">23<span className="text-sm">명</span></p>
                  <p className="text-[10px] text-slate-500">회장, 이사, 감사 등</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Total Members</p>
                  <p className="text-3xl font-black text-white">1,884<span className="text-sm">명</span></p>
                  <p className="text-[10px] text-slate-500">정회원, 준회원, 단체</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Founders</p>
                  <p className="text-3xl font-black text-white">22<span className="text-sm">명</span></p>
                  <p className="text-[10px] text-slate-500">2007년 발기인 대회</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Global Reach</p>
                  <p className="text-3xl font-black text-white">19<span className="text-sm">th</span></p>
                  <p className="text-[10px] text-slate-500">창립 19주년 (2026)</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- 협회 연혁 (PDF 3~4페이지 상세 반영) --- */}
        {activeTab === 'history' && (
          <section className="max-w-4xl mx-auto px-6 py-24">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black mb-4 text-white tracking-tight">협회 연혁</h2>
              <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">Chronicle of KPCGA Excellence</p>
            </div>
            <div className="space-y-20 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-1 before:bg-white/5">
              {[
                { year: '2024~2026', title: '미래 지향적 통합 상담 체계기', desc: 'AI 기반 심리 검사 데이터 분석 시스템 시범 도입 및 자격 관리 체계의 디지털 표준화 선도' },
                { year: '2016~2022', title: '영역 확장 및 사회적 전문성 고도화기', desc: '분노조절, 위기상담 전문 과정 런칭 및 팬데믹 대응 비대면 심리 지원 가이드라인 수립' },
                { year: '2011~2015', title: '검사 도구 개발 및 자격 체계화기', desc: '미술심리상담사 등록(KRIVET) 및 한국휴먼에니어그램 검사지(AD형) 저작권 등록 및 배포' },
                { year: '2007~2010', title: '설립 및 학·군 협력 기반 구축기', desc: '한국심리상담지도협회 창립총회 개최 및 건국대, 공주대, 목원대 등 주요 교육기관과 협약 체결' }
              ].map((item, i) => (
                <div key={i} className="flex gap-12 group">
                  <div className="w-12 h-12 bg-[#0a0c10] border-4 border-indigo-600 rounded-full flex items-center justify-center text-indigo-500 font-black z-10 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-[0_0_40px_rgba(79,70,229,0.2)]">
                    <Award size={20} />
                  </div>
                  <div className="pt-2">
                    <span className="bg-indigo-600/10 text-indigo-400 px-5 py-1.5 rounded-full text-sm font-black mb-6 inline-block tracking-widest">{item.year}</span>
                    <h4 className="text-3xl font-black mb-4 text-white group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- 상담 및 게시판 --- */}
        {(activeTab === 'counsel' || activeTab === 'board') && (
          <section className="max-w-6xl mx-auto px-6 py-40 text-center">
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-slate-900/50 p-24 rounded-[5rem] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-[0.02] font-black text-9xl uppercase tracking-tighter">Under Construction</div>
              <div className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto animate-bounce border border-indigo-500/20 shadow-xl"><Edit3 size={48}/></div>
              <h2 className="text-5xl font-black text-white">{activeTab === 'counsel' ? '상담 신청실' : '자유 게시판'}</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-medium">더 나은 전문 상담 서비스를 제공하기 위해<br />시스템 고도화 작업을 진행 중입니다.</p>
              <button onClick={() => setActiveTab('home')} className="bg-indigo-600 text-white px-16 py-6 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">메인으로 돌아가기</button>
            </motion.div>
          </section>
        )}
      </main>

      {/* --- 푸터 (PDF 연락처 및 주소 반영) --- */}
      <footer className="bg-black pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 border-b border-white/5 pb-20 mb-16">
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl">K</div>
              <span className="text-2xl font-black tracking-tighter">KPCGA</span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">국민의 마음 건강을 지키는 든든한 동반자,<br />한국심리상담지도협회가 함께합니다.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer border border-white/5"><Phone size={18}/></div>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer border border-white/5"><Mail size={18}/></div>
            </div>
          </div>
          <div className="space-y-10">
            <h5 className="font-black text-xl text-white tracking-tight">Contact Info</h5>
            <ul className="space-y-7 text-slate-400 text-lg font-medium">
              <li className="flex items-center gap-5 group hover:text-indigo-400 transition-colors"><Phone size={22} className="text-indigo-600 group-hover:scale-110 transition-transform"/> 02-123-4567</li>
              <li className="flex items-center gap-5 group hover:text-indigo-400 transition-colors"><Mail size={22} className="text-indigo-600 group-hover:scale-110 transition-transform"/> contact@kpcga.or.kr</li>
              <li className="flex items-center gap-5 leading-snug group hover:text-indigo-400 transition-colors"><MapPin size={22} className="text-indigo-600 group-hover:scale-110 transition-transform shrink-0"/> 경기도 고양시 토당로 52 능곡역프라자 201호</li>
            </ul>
          </div>
          <div className="space-y-10">
            <h5 className="font-black text-xl text-white tracking-tight">Association Logic</h5>
            <div className="text-slate-500 text-lg space-y-3 font-medium">
              <p>회원: 1,884명 (정회원, 준회원 및 단체)</p>
              <p>구성: 회장, 부회장(5), 이사(15), 감사(2)</p>
              <p className="text-indigo-500 font-bold italic mt-6 underline underline-offset-8 decoration-2 decoration-indigo-500/30">Psychology Counseling Leader</p>
            </div>
          </div>
        </div>
        <div className="text-center px-6">
          <p className="text-slate-800 text-[10px] uppercase tracking-[0.6em] font-black mb-6">© 2026 KPCGA KOREA PSYCHOLOGY COUNSELING ASSOCIATION</p>
          <div className="flex justify-center gap-8 text-[9px] font-black text-slate-800 uppercase tracking-widest">
            <span className="hover:text-indigo-900 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-indigo-900 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-indigo-900 cursor-pointer transition-colors">Admin Portal</span>
          </div>
          <p className="text-slate-900 text-[8px] mt-8 font-bold tracking-tighter">Digital Infrastructure & AI Solutions Powered by Heung-wei Ryu Portfolio</p>
        </div>
      </footer>
    </div>
  );
};

export default App;