import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, FormEvent, SyntheticEvent, DragEvent } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ChevronRight, Users, LogOut, MessageCircle, Share2, Award,
  BookOpen, Heart, BarChart3, CheckCircle2, Target, Flag,
  ShieldCheck, UserCheck, Shield, Menu, X, MapPin, Phone,
  UserPlus, LogIn, ClipboardList, Camera, FileText, User as UserIcon,
  ChevronDown, PenBox, AlertCircle, Trash2, Edit3, Send, Sparkles, Loader2,
  CheckCircle, MessageSquare, Lock, ChevronLeft, Image as ImageIcon, Cpu, Plus,
  Mail, Key, UserCircle, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. 타입 정의 (Interfaces)
// ==========================================

interface UserAccount {
  email: string;
  pw: string;
  name: string;
}

interface Consultation {
  id: number;
  name: string;
  phone?: string;
  content: string;
  date: string;
  status: '접수대기' | '처리완료';
  reply: string;
}

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  category: string;
  imageUrl?: string;
}

// ==========================================
// 2. 환경 설정 및 AI 엔진
// ==========================================

const getEnvApiKey = (): string => {
  try {
    // @ts-ignore
    const viteKey = import.meta.env?.VITE_GEMINI_API_KEY;
    if (viteKey) return viteKey;
    // @ts-ignore
    const processKey = process.env?.VITE_GEMINI_API_KEY;
    if (processKey) return processKey;
  } catch (e) {}
  return ""; 
};
async function askGemini(prompt: string, systemContext: string): Promise<string> {
  // 1. 열쇠 설정 (.env 파일에 숨겨둔 안전한 열쇠를 불러옵니다)
  const currentKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(currentKey);

  // 2. 상담사 모델 설정 (가장 안정적이고 전 세계 어디서나 작동하는 gemini-pro 모델로 변경합니다)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // 3. 상담 원칙 설정
  const fullPrompt = `[상담사 페르소나 및 원칙]
${systemContext}
1. 전문 상담가로서 따뜻하고 공감하는 말투를 유지하세요.
2. 구체적인 조언을 3문장 이상 상세하게 제공하세요.
3. 반드시 한국어로만 답변하세요.

[사용자 고민 내용]
${prompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API 에러:", error);
    return "현재 상담실 연결이 어렵습니다. 잠시 후 다시 시도해 주세요.";
  }
}


function maskName(name: string): string { //
  if (!name) return "";
  if (name.length <= 2) return name.charAt(0) + "*";
  return name.charAt(0) + "*".repeat(name.length - 2) + name.charAt(name.length - 1);
  } //

const HERO_IMAGES = [
  "/메타상담.png",
  "/극동대.png",
  "/검사지.png",
  "/TDRA검사지.jpg",
  "/학회.png",
  "/협약.png"
];

const FALLBACK_HERO = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000";

// ==========================================
// 3. 하부 UI 컴포넌트
// ==========================================

const AuthModal = ({ isOpen, onClose, onLoginSuccess, onRegisterSuccess, registeredUsers, initialType }: any) => {
  const [authType, setAuthType] = useState(initialType);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthType(initialType);
    setError('');
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (authType === 'admin') {
      if (email === 'admin' && pw === '1224') {
        onLoginSuccess('admin', '관리자');
        onClose();
      } else {
        setError('관리자 정보가 일치하지 않습니다.');
      }
    } else if (authType === 'login') {
      const user = registeredUsers.find((u: UserAccount) => u.email === email && u.pw === pw);
      if (user) {
        onLoginSuccess('user', user.name);
        onClose();
      } else {
        setError('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    } else {
      const exists = registeredUsers.find((u: UserAccount) => u.email === email);
      if (exists) {
        setError('이미 가입된 이메일 주소입니다.');
        return;
      }
      onRegisterSuccess({ email, pw, name });
      setAuthType('login');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-900 border border-white/10 w-full max-w-md p-8 rounded-[40px] shadow-2xl relative text-white">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
        <h2 className="text-3xl font-black mb-8 uppercase text-center tracking-tighter">
          {authType === 'admin' ? 'Admin' : authType === 'login' ? 'Login' : 'Join Us'}
        </h2>
        <form className="space-y-4" onSubmit={handleAuthSubmit}>
          <input type="text" placeholder="이메일 또는 ID" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-600 font-bold text-white transition-all shadow-inner" />
          {authType === 'register' && (
            <input type="text" placeholder="이름 (성함)" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-600 font-bold text-white transition-all shadow-inner" />
          )}
          <input type="password" placeholder="비밀번호" required value={pw} onChange={(e) => setPw(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-600 font-bold text-white transition-all shadow-inner" />
          {error && <div className="text-red-500 text-sm bg-red-500/10 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold border border-red-500/20 text-center"><AlertCircle size={16} />{error}</div>}
          <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all">확인</button>
        </form>
        {(authType === 'login' || authType === 'register') && (
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-gray-400">
            <p className="text-sm font-medium">
              {authType === 'login' ? '아직 회원이 아니신가요?' : '이미 회원이신가요?'}
              <button onClick={() => { setAuthType(authType === 'login' ? 'register' : 'login'); setError(''); }} className="ml-2 text-purple-400 font-black hover:underline transition-all">
                {authType === 'login' ? '회원가입 하기' : '로그인 하기'}
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ConsultationReplyModal = ({ isOpen, onClose, consultation, onReplySubmit }: any) => {
  const [reply, setReply] = useState('');
  if (!isOpen || !consultation) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-left text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 border border-white/10 w-full max-w-2xl p-8 rounded-[40px] shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold tracking-tight">상담 답변 작성</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
          <p className="text-purple-400 text-xs font-bold mb-1 uppercase tracking-widest">상담 신청 내용</p>
          <p className="text-gray-200 text-sm leading-relaxed">{consultation.content}</p>
        </div>
        <textarea placeholder="상담자에게 전달할 답변을 입력하세요..." className="w-full h-40 bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-600 font-medium mb-6 resize-none shadow-inner" value={reply} onChange={(e) => setReply(e.target.value)} />
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 bg-white/10 font-bold rounded-2xl text-white transition-all hover:bg-white/20">취소</button>
          <button onClick={() => { onReplySubmit(consultation.id, reply); onClose(); setReply(''); }} className="flex-1 py-4 bg-purple-600 font-bold rounded-2xl text-white hover:brightness-110 transition-all shadow-lg shadow-purple-600/20">답변 등록 완료</button>
        </div>
      </motion.div>
    </div>
  );
};

const PostWriteModal = ({ isOpen, onClose, activeTab, onPostSubmit }: any) => {
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '' });
  const [isDragging, setIsDragging] = useState(false);
  if (!isOpen) return null;
  const handleImageDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };
  const categoryName = activeTab === 'gallery' ? '사진 자료실' : activeTab === 'notice' ? '공지사항' : '자유게시판';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-left text-white">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-900 border border-white/10 w-full max-w-2xl p-8 rounded-[40px] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold tracking-tight">게시글 작성 <span className="text-purple-400 text-lg">({categoryName})</span></h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="제목을 입력하세요" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 font-bold text-white transition-all shadow-inner" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
          {activeTab === 'gallery' && (
            <div onDrop={handleImageDrop} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`w-full min-h-[150px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5'}`}>
              {form.imageUrl ? <img src={form.imageUrl} className="max-h-32 rounded-xl shadow-lg" alt="미리보기" /> : <div className="text-center text-gray-500 p-6 pointer-events-none text-sm font-medium"><Upload className="mx-auto mb-2 text-gray-400" size={32} /><p>사진 파일을 드래그하여 놓으세요</p></div>}
            </div>
          )}
          <input type="text" placeholder="이미지 URL (선택사항)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 font-medium text-white text-sm shadow-inner" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} />
          <textarea placeholder="내용을 입력하세요" className="w-full h-40 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 font-medium text-white resize-none transition-all shadow-inner" value={form.content} onChange={(e: any) => setForm({...form, content: e.target.value})} />
        </div>
        <button onClick={() => { onPostSubmit(form); onClose(); setForm({ title: '', content: '', imageUrl: '' }); }} className="w-full mt-8 py-4 bg-purple-600 font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] shadow-xl transition-all text-white uppercase tracking-tighter">등록하기</button>
      </motion.div>
    </div>
  );
};

const PostDetailModal = ({ post, onClose, onDelete }: { post: Post | null, onClose: () => void, onDelete?: (id: number) => void }) => {
  if (!post) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl text-left text-white">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 border border-white/10 w-full max-w-4xl p-10 md:p-16 rounded-[64px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-10 right-10 text-white/30 hover:text-white transition-colors bg-white/5 p-3 rounded-full"><X size={32} /></button>
        <div className="mb-12 border-b border-white/10 pb-10 text-left">
          <span className="text-sm font-black text-purple-500 mb-4 block uppercase tracking-[0.2em]">{post.category}</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">{post.title}</h2>
          <div className="flex gap-8 text-gray-500 font-bold">
            <span className="flex items-center gap-2 font-medium text-gray-400"><UserIcon size={18} /> {post.author}</span>
            <span className="flex items-center gap-2 font-mono text-gray-500"><ClipboardList size={18} /> {post.date}</span>
          </div>
        </div>
        {post.imageUrl && (
          <div className="mb-12 rounded-[48px] overflow-hidden border border-white/10 bg-black shadow-2xl flex justify-center">
            <img src={post.imageUrl} alt="post" className="max-w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
        <div className="text-gray-300 leading-relaxed text-lg md:text-xl font-medium whitespace-pre-wrap mb-16 text-left">{post.content}</div>
        <div className="pt-10 border-t border-white/10 flex justify-between items-center">
          {onDelete && (
             <button onClick={() => { onDelete(post.id); onClose(); }} className="px-8 py-3 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-2 font-black hover:bg-red-500 hover:text-white transition-all text-sm uppercase tracking-tighter">
               <Trash2 size={20} /> Delete Post
             </button>
          )}
          <button onClick={onClose} className="px-12 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all ml-auto uppercase tracking-tighter shadow-lg">Back to List</button>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// 4. 메인 어플리케이션
// ==========================================

export default function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, type: 'login' as 'login' | 'register' | 'admin' });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState('notice');
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);

  // 로컬 스토리지 데이터 축적 관리
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('KPCGA_USERS');
    return saved ? JSON.parse(saved) : [];
  });
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem('KPCGA_CONSULTATIONS');
    return saved ? JSON.parse(saved) : [
      { id: 101, name: '김**', content: '진로 문제와 미래에 대한 불안감으로 상담받고 싶습니다.', date: '2025.03.15', status: '처리완료', reply: '상담 요청이 확인되었습니다. 협회 전문 상담사를 통해 도움을 드릴 수 있습니다.' },
      { id: 102, name: '이**', content: '가족 간의 소통 부재로 힘든 시기를 보내고 있어요.', date: '2025.03.20', status: '접수대기', reply: '' }
    ];
  });
  const [posts, setPosts] = useState<Record<string, Post[]>>(() => {
    const saved = localStorage.getItem('KPCGA_POSTS');
    return saved ? JSON.parse(saved) : {
      notice: [{ id: 1, title: '2025년 하반기 전문상담사 교육생 모집 안내', author: '관리자', date: '2025.03.01', content: '체계적인 상담 실습 과정을 포함한 교육을 시작합니다.', category: '공지사항', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000' }],
      free: [{ id: 2, title: '첫 상담을 다녀와서 적어봅니다.', author: '박**', date: '2025.03.10', content: '상담사님이 너무 잘 들어주셔서 큰 위로가 되었어요.', category: '자유게시판' }],
      gallery: [{ id: 3, title: '작년 동계 학술 세미나 현장 스케치', author: '관리자', date: '2024.12.15', content: '전국의 상담 전문가들이 모여 최신 지견을 나누었습니다.', category: '사진 자료실', imageUrl: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=80&w=1000' }]
    };
  });

  useEffect(() => { localStorage.setItem('KPCGA_USERS', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('KPCGA_CONSULTATIONS', JSON.stringify(consultations)); }, [consultations]);
  useEffect(() => { localStorage.setItem('KPCGA_POSTS', JSON.stringify(posts)); }, [posts]);

  const onLoginSuccess = (role: string, name: string) => { setUserRole(role); setCurrentUserName(name); };
  const onLogout = () => { setUserRole(null); setCurrentUserName(null); };
  const handleRegisterSuccess = (user: UserAccount) => setRegisteredUsers(prev => [...prev, user]);
  const handleConsultSubmit = (data: { name: string, phone: string, content: string }) => {
    const newC: Consultation = { id: Date.now(), ...data, date: new Date().toLocaleDateString(), status: '접수대기', reply: '' };
    setConsultations(prev => [newC, ...prev]);
  };
  const handleReplySubmit = (id: number, reply: string) => setConsultations(prev => prev.map(c => c.id === id ? { ...c, reply, status: '처리완료' } : c));
  const handlePostSubmit = (form: { title: string, content: string, imageUrl: string }) => {
    const newPost: Post = { id: Date.now(), ...form, author: currentUserName || '관리자', date: new Date().toLocaleDateString(), category: activeTab === 'gallery' ? '사진 자료실' : activeTab === 'notice' ? '공지사항' : '자유게시판' };
    setPosts(prev => ({ ...prev, [activeTab]: [newPost, ...prev[activeTab]] }));
  };
  const handlePostDelete = (id: number) => setPosts(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(p => p.id !== id) }));

  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setImgIndex(p => (p + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const programs = [
    { title: '개인 정서 상담', desc: '마음의 건강과 심리적 안정을 찾는 1:1 맞춤형 정서 치유 과정' },
    { title: '부부 및 가족 솔루션', desc: '가족 간의 갈등 해결과 화합을 돕는 전문적인 관계 상담 프로그램' },
    { title: '청소년 진로 및 학업 상담', desc: '미래를 설계하고 학업 동기를 고취시키는 청소년 특화 성장 상담' },
    { title: 'AI 심층 심리 분석', desc: '인공지능 기술을 활용한 빠르고 객관적인 심리 상태 정밀 진단' },
    { title: 'META 상담', desc: '자신의 인지 과정을 객관적으로 통찰하여 변화를 이끄는 심층 상담' },
    { title: 'K5(K-TDRI)검사', desc: '성격과 기질을 심도 있게 파악하여 자기 이해를 돕는 표준화 검사' }
  ];

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [userInput, setUserInput] = useState("");
  const [form, setForm] = useState({ name: '', phone: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#050505] min-h-screen font-sans selection:bg-purple-500/30 text-white overflow-x-hidden text-left">
      {/* 1. 상단 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/70 backdrop-blur-xl py-3 border-b border-white/5 transition-all">
        <div className="container mx-auto px-6 flex justify-between items-center text-white">
          <a href="#" className="p-1.5 bg-white rounded-lg hover:scale-105 transition-transform shadow-lg"><img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" /></a>
          <div className="hidden md:flex items-center gap-8 text-[15px]">
            <div className="flex gap-7 font-bold">
              {['인사말', '연혁', '상담신청', '상담현황', '게시판'].map(m => <a key={m} href={`#${m}`} className="text-gray-300 hover:text-white transition-colors no-underline font-black">{m}</a>)}
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              {userRole ? (
                <div className="flex items-center gap-3"><span className="text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full shadow-sm">{currentUserName}님</span><button onClick={onLogout} className="text-xs text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest">Logout</button></div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => setAuthModal({ isOpen: true, type: 'login' })} className="text-white bg-white/10 border border-white/20 px-5 py-2 rounded-full hover:bg-white/20 font-bold transition-all text-sm">로그인</button>
                  <button onClick={() => setAuthModal({ isOpen: true, type: 'register' })} className="text-white bg-purple-600 px-5 py-2 rounded-full hover:bg-purple-500 font-bold transition-all text-sm shadow-lg shadow-purple-600/20">회원가입</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. 히어로 섹션 */}
      <section className="relative h-screen flex items-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-0 text-left">
          <AnimatePresence mode="wait">
            <motion.img key={imgIndex} src={HERO_IMAGES[imgIndex]} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeInOut" }} className="w-full h-full object-cover" onError={(e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = FALLBACK_HERO; }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 relative z-20 text-left pt-20">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl text-white text-left">
            <h1 className="text-5xl md:text-8xl font-black leading-tight mb-8 tracking-tighter">마음의 평온을 찾는<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">새로운 여정</span></h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl font-medium leading-relaxed">한국심리상담지도협회는 전문적인 상담과 교육을 통해<br />당신의 삶에 따뜻한 변화를 선물합니다.</p>
            <div className="flex gap-4">
              <a href="#상담신청" className="px-9 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-500 no-underline transition-all font-black text-center shadow-purple-600/20">상담 신청하기</a>
              <a href="#인사말" className="px-9 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 no-underline transition-all font-black text-center">협회 소개</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. 인사말 전문 보완 */}
      <section id="인사말" className="py-32 bg-black relative text-center px-6 overflow-hidden text-white">
        <div className="max-w-5xl mx-auto bg-neutral-900/40 p-12 md:p-20 rounded-[64px] border border-white/10 shadow-2xl backdrop-blur-sm relative z-10 text-left">
          <h2 className="text-4xl md:text-5xl font-black mb-16 uppercase tracking-tighter text-center">Director's Message</h2>
          <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed font-medium text-left">
            <p>한국심리상담지도협회가 시작되어 짧지 않은 시간이 지났습니다. 2007년 3월 실무이사 7명, 심리상담 전공교수 15명 등 22명이 발기인대회를 갖고 창립총회를 연 것이 엊그제 같은데 이제는 1,900여 명의 회원과 전문인력을 보유한 심리상담 전문가 단체로 발전하였습니다.</p>
            <p>그동안 어려운 여건 속에서도 심리상담과 청소년진로에 관한 연구와 프로그램을 개발·보급하고 이를 현장에 접목시켜 온 회원 여러분에게 심심한 존경과 감사의 말씀을 드립니다. 여러분께서 잘 아시는 바와 같이 우리 협회의 심리상담 프로그램은 독창성과 현장성이 결집된 실용적기법이 폭넓게 적용되어 때와 장소, 각계각층을 불문하고 다양한 형태로 활용되고 있습니다.</p>
            <p>우리 협회가 개발한 성격검사지, 진로 및 심리상담 프로그램과 심리상담 실무자들의 우수한 능력과 자질이 높이 평가되어 심리상담 전문가 그룹으로 그 위상과 지위를 확고하게 다져나가고 있습니다. 2014년부터는 청소년상담심리학회 및 한국청소년보호연맹과 전략적으로 제휴하여 연구 성과물의 교류와 협력 및 상담심리 전문가 양성을 위한 자격연수과정 개설에 합의하는 성과를 거두었습니다.</p>
            <p>이제 우리는 보다 탄탄하게 내실을 다져나가면서 상황에 맞는 이론과 실무를 병행하여 나가도록 하겠습니다. 앞으로 협회원 한 분 한 분의 풍부한 경험과 전문지식이 결집되어 우리 협회가 한 단계 더 뛰어오를 수 있는 도약의 기회를 만들어 나가도록 기대하며 회원 여러분의 폭넓은 관심과 격려를 부탁드립니다.</p>
            <div className="pt-16 border-t border-white/10 text-right"><p className="text-2xl md:text-3xl font-black text-white tracking-tighter">한국심리상담지도협회장 드림</p></div>
          </div>
        </div>
      </section>

      {/* 4. 연혁 (4단계) */}
      <section id="연혁" className="py-32 bg-[#050505] border-t border-white/5 text-center px-6">
        <h2 className="text-4xl font-bold mb-20 uppercase text-white tracking-tighter">History</h2>
        <div className="max-w-4xl mx-auto space-y-24 text-left relative text-white">
          <div className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-white/10 to-transparent" />
          {[
            { period: "2007 - 2010", title: "설립 및 기반 구축기", items: [{ date: "2007. 03", text: "한국심리상담지도협회 창립총회 개최" }, { date: "2007. 12", text: "건국대학교 사회교육원 교육과정 협약" }, { date: "2010. 02", text: "여성가족부 경력단절여성 집단상담 운영" }, { date: "2010. 08", text: "육군방공학교 간부·가족 상담 교육 실시" }] },
            { period: "2011 - 2015", title: "검사 도구 및 자격 체계화기", items: [{ date: "2011. 06", text: "미술심리상담사 민간자격 등록" }, { date: "2011. 07", text: "한국휴먼에니어그램 검사지 개발" }, { date: "2013. 05", text: "가족 및 노인심리상담사 과정 확대" }, { date: "2015. 10", text: "실무자 보수 교육 시스템(LMS) 설계" }] },
            { period: "2016 - 2022", title: "영역 확장 및 전문성 고도화기", items: [{ date: "2016. 04", text: "분노조절 및 위기심리상담사 런칭" }, { date: "2020. 03", text: "비대면 심리 지원 가이드라인 수립" }, { date: "2022. 11", text: "아동·청소년 진로 상담 도구 고도화" }] },
            { period: "2024 - 현재", title: "미래 지향적 통합 상담 체계기", items: [{ date: "2024. 05", text: "다문화 가정 심리 상담 매뉴얼 보급" }, { date: "2025. 02", text: "AI 기반 심리 검사 분석 시스템 도입" }, { date: "2026. 01", text: "협회 창립 19주년, 표준화 선도" }] }
          ].map((group, idx) => (
            <div key={idx} className="relative pl-12 md:pl-20 group text-left">
              <div className="absolute left-4 md:left-8 top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-black z-10 shadow-[0_0_10px_rgba(147,51,234,0.8)]" />
              <div className="mb-6 text-left"><span className="text-purple-400 font-black text-sm tracking-widest uppercase mb-1 block">{group.period}</span><h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{group.title}</h3></div>
              <div className="space-y-6 text-white text-left">
                {group.items.map((item, i) => (<div key={i} className="flex flex-col md:flex-row gap-2 md:gap-8 items-start text-left"><span className="text-purple-300/70 font-mono text-lg font-bold min-w-[90px]">{item.date}</span><p className="text-gray-300 text-lg font-medium leading-tight">{item.text}</p></div>))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 상담 섹션 (균형 잡힌 레이아웃) */}
      <section id="상담신청" className="py-32 bg-black border-t border-white/5 px-6 text-left">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 items-stretch">
          {/* 좌측 프로그램 리스트 */}
          <div className="flex flex-col h-full bg-neutral-900/30 p-8 rounded-[40px] border border-white/5 text-left shadow-2xl">
            <h2 className="text-4xl font-black mb-10 text-white tracking-tighter uppercase">Counseling Programs</h2>
            <div className="grid gap-4 flex-grow">
              {programs.map((p, i) => (
                <div key={i} className="p-6 rounded-[24px] bg-neutral-900 border border-white/5 flex items-center gap-6 text-white hover:bg-white/[0.03] transition-all group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shrink-0"><CheckCircle size={24} /></div>
                  <div className="text-left flex-1">
                    <h4 className="text-lg font-black tracking-tight mb-2 text-left">{p.title}</h4>
                    <p className="text-[13px] md:text-sm text-gray-400 font-medium leading-relaxed text-left">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 우측 상단 AI / 하단 신청서 */}
          <div className="flex flex-col gap-8 text-left h-full">
            <div className="p-10 rounded-[40px] bg-gradient-to-br from-neutral-800 to-black border border-white/10 shadow-2xl relative overflow-hidden flex-shrink-0">
              <div className="flex items-center gap-4 mb-8 text-left">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20"><Sparkles size={24} className="text-white" /></div>
                <h4 className="text-2xl font-black text-white tracking-tighter text-left uppercase">AI 상담 솔루션</h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="마음의 이야기를 들려주세요..." className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-purple-600 font-bold transition-all text-lg shadow-inner" />
                <button onClick={async () => {
                  if (!userInput.trim() || aiLoading) return;
                  setAiLoading(true); setAiSuggestion("");
                  const res = await askGemini(userInput, "당신은 한국심리상담지도협회 수석 상담가입니다.");
                  setAiSuggestion(res); setAiLoading(false);
                }} className="px-10 py-6 bg-white text-black font-black rounded-3xl hover:bg-gray-200 transition-all uppercase shadow-lg active:scale-95">{aiLoading ? "..." : "AI 솔루션"}</button>
              </div>
              <AnimatePresence>{aiSuggestion && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 bg-white/[0.03] rounded-[30px] border border-white/5 text-gray-200 text-left whitespace-pre-wrap font-medium leading-relaxed shadow-inner overflow-hidden text-sm md:text-base">{aiSuggestion}</motion.div>}</AnimatePresence>
            </div>
            <div className="bg-neutral-900 p-10 rounded-[40px] border border-white/10 shadow-2xl flex-grow flex flex-col justify-center text-left">
              <h3 className="text-3xl font-black mb-8 text-center text-white tracking-tighter uppercase text-center">상담 신청서 작성</h3>
              {submitted ? <div className="text-center text-emerald-400 font-bold py-16 text-xl animate-pulse">상담 신청이 완료되었습니다.</div> : (
                <form onSubmit={(e) => { e.preventDefault(); handleConsultSubmit(form); setSubmitted(true); setTimeout(() => { setSubmitted(false); setForm({ name: '', phone: '', content: '' }); }, 3000); }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-left text-white">
                    <input type="text" placeholder="성함" required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-600 font-bold text-white transition-all shadow-inner" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input type="tel" placeholder="연락처" required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-600 font-bold text-white transition-all shadow-inner" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <textarea placeholder="상담 내용을 편안하게 적어주세요." required className="w-full h-40 bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-600 text-white resize-none font-medium leading-relaxed transition-all shadow-inner" value={form.content} onChange={(e: any) => setForm({...form, content: e.target.value})} />
                  <button type="submit" className="w-full py-6 bg-white text-black font-black rounded-3xl text-xl hover:bg-gray-200 transition-all uppercase tracking-tighter shadow-2xl active:scale-[0.98]">상담 접수</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. 상담 현황 */}
      <section id="상담현황" className="py-32 bg-[#050505] border-t border-white/5 px-6 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-black mb-20 tracking-tighter uppercase">Current Status</h2>
        <div className="max-w-6xl mx-auto bg-neutral-900 rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto text-white">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-black/50 text-gray-500 font-black text-xs uppercase tracking-widest">
                <tr><th className="px-10 py-8 text-center">Status</th><th className="px-10 py-8">Content Summary</th><th className="px-10 py-8 text-center">Applicant</th><th className="px-10 py-8 text-center">Manage</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {consultations.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] group">
                    <td className="px-10 py-8 text-center"><span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-tighter ${c.status === '처리완료' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/20 text-orange-400 border border-orange-500/20'}`}>{c.status}</span></td>
                    <td className="px-10 py-8 text-left"><div className="truncate max-w-md font-bold text-gray-200">{c.content}</div>
                      {c.reply && ((userRole === 'admin' || (currentUserName && currentUserName === c.name)) ? (<div className="mt-3 p-4 bg-purple-500/5 border-l-2 border-purple-500 rounded-r-xl text-sm text-purple-300 font-medium leading-relaxed text-left"><span className="text-purple-500 font-black mr-2">A.</span> {c.reply}</div>) : (<div className="mt-3 p-4 bg-white/5 border-l-2 border-gray-600 rounded-r-xl text-sm text-gray-500 font-medium italic flex items-center gap-2"><Lock size={12} /> 비밀 답변입니다. (본인 전용)</div>))}
                    </td>
                    <td className="px-10 py-8 text-center text-gray-400 font-bold">{maskName(c.name)}</td>
                    <td className="px-10 py-8 text-center">{userRole === 'admin' ? (<button onClick={() => { setCurrentConsultation(c); setReplyModalOpen(true); }} className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs hover:bg-white text-black transition-all font-black uppercase tracking-tighter shadow-lg">Reply</button>) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. 게시판 */}
      <section id="게시판" className="py-32 bg-black border-t border-white/5 px-6 text-white text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-white">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Board</h2>
          <div className="flex gap-3 bg-neutral-900 p-2 rounded-[28px] border border-white/10">
            {['notice', 'free', 'gallery'].map((t) => (<button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded-2xl font-black text-xs transition-all uppercase tracking-tighter ${activeTab === t ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-gray-500 hover:text-white'}`}>{t === 'notice' ? '공지사항' : t === 'free' ? '자유게시판' : '사진 자료실'}</button>))}
          </div>
        </div>
        <div className="max-w-5xl mx-auto">
          {userRole === 'admin' && (<button onClick={() => setWriteModalOpen(true)} className="w-full mb-8 py-6 border-2 border-dashed border-white/10 rounded-[32px] text-gray-500 font-black hover:border-purple-600 hover:text-purple-400 transition-all flex items-center justify-center gap-2 uppercase tracking-tighter shadow-2xl"><Plus size={20} /> 글쓰기</button>)}
          <div className="grid gap-6">
            {posts[activeTab].map(p => (
              <motion.div layout key={p.id} onClick={() => setSelectedPost(p)} className="p-8 rounded-[40px] bg-neutral-900 border border-white/5 hover:border-white/20 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center group transition-all text-white">
                <div className="flex gap-8 items-center w-full text-left">
                  {p.imageUrl && <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] overflow-hidden shrink-0 bg-black border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500"><img src={p.imageUrl} className="w-full h-full object-cover" alt="thumb" /></div>}
                  <div className="flex-1 text-left text-white">
                    <span className="text-xs font-black text-purple-500 mb-2 block uppercase tracking-widest">{p.category}</span>
                    <h4 className="text-xl font-black mb-3 group-hover:text-purple-400 transition-colors tracking-tighter leading-tight text-white">{p.title}</h4>
                    <p className="text-gray-500 font-bold text-sm text-white">{p.author} <span className="mx-2 opacity-30 text-white">|</span> {p.date}</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-500 group-hover:text-white transition-all shadow-purple-600/30" />
              </motion.div>
            ))}
            {posts[activeTab].length === 0 && (
              <div className="py-32 text-center bg-white/[0.02] rounded-[48px] border border-dashed border-white/10">
                <p className="text-gray-500 font-black text-lg tracking-tighter uppercase opacity-50">No Data Cumulative</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. 푸터 */}
      <footer className="py-24 bg-black border-t border-white/10 text-center text-white px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
           <div className="p-3 bg-white rounded-[20px] shadow-2xl shadow-white/5"><img src="/logo.png" alt="Footer Logo" className="h-12 w-auto" /></div>
           <div className="flex flex-col gap-6 text-gray-500 font-bold text-lg text-center items-center">
             <button onClick={() => setAuthModal({ isOpen: true, type: 'admin' })} className="text-purple-500 hover:text-purple-400 transition-all font-black text-xs uppercase tracking-[0.5em] bg-purple-500/5 px-10 py-3 rounded-full border border-purple-500/20 hover:border-purple-500/50 shadow-2xl">ADMIN</button>
             <div className="space-y-4 text-center">
               <p className="text-sm flex flex-wrap justify-center gap-x-6 opacity-70 text-white font-black text-center">
                 <span><MapPin size={16} className="inline mr-1" /> 경기도 수원시 팔달구 고등로 18-202호</span>
                 <span><Phone size={16} className="inline mr-1" /> 031-566-1318</span>
               </p>
               <div className="text-[10px] text-gray-600 font-black flex flex-wrap justify-center gap-x-8 gap-y-2 opacity-50 border-t border-white/5 pt-4 text-center uppercase tracking-widest">
                 <span className="hover:text-white cursor-pointer transition-colors text-white">이용약관</span>
                 <span className="hover:text-white cursor-pointer transition-colors text-white">개인정보처리방침</span>
                 <span className="hover:text-white cursor-pointer transition-colors text-white">이메일주소 무단수집 거부</span>
               </div>
             </div>
           </div>
           <p className="text-[10px] tracking-[0.3em] uppercase font-black text-gray-700 w-full pt-10 border-t border-white/5">© 2026 KPCGA. All Rights Reserved.</p>
        </div>
      </footer>

      {/* 모달 연동 (하부 컴포넌트 호출) */}
      <AuthModal isOpen={authModal.isOpen} onClose={() => setAuthModal({ ...authModal, isOpen: false })} onLoginSuccess={onLoginSuccess} onRegisterSuccess={handleRegisterSuccess} registeredUsers={registeredUsers} initialType={authModal.type} />
      <ConsultationReplyModal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)} consultation={currentConsultation} onReplySubmit={handleReplySubmit} />
      <PostWriteModal isOpen={writeModalOpen} onClose={() => setWriteModalOpen(false)} activeTab={activeTab} onPostSubmit={handlePostSubmit} />
      <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} onDelete={userRole === 'admin' ? handlePostDelete : undefined} />
      
      <AiChatBot askGeminiFunc={askGemini} />
    </div>
  );
}

function AiChatBot({ askGeminiFunc }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([{ role: 'ai', text: '안녕하세요! 한국심리상담지도협회 마음이음 AI 챗봇입니다. 😊' }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input; setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    const response = await askGeminiFunc(userMsg, "당신은 상담협회의 다정한 AI 상담원입니다.");
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };
  return (
    <div className="fixed bottom-10 right-10 z-[250] flex flex-col items-end gap-6 text-white text-left">
      <AnimatePresence>{isOpen && (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="w-[350px] sm:w-[420px] h-[650px] bg-[#0a0a0a] border border-white/10 rounded-[48px] shadow-2xl flex flex-col overflow-hidden text-left relative text-white">
          <div className="p-8 bg-gradient-to-b from-neutral-900 to-neutral-950 flex justify-between items-center text-white">
            <div className="flex items-center gap-4 text-white shadow-purple-600/20"><div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-xl text-white shadow-lg">AI</div><h5 className="font-black text-lg text-white">마음이음 챗봇</h5></div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><X size={20} /></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-[#0a0a0a] text-left">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} text-left text-white`}>
                <div className={`max-w-[85%] px-6 py-4 rounded-[28px] text-base leading-relaxed font-medium shadow-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-neutral-800 text-gray-200 rounded-tl-none border border-white/5 text-white'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex justify-start text-white"><Loader2 size={16} className="animate-spin text-purple-500" /></div>}
          </div>
          <div className="p-6 bg-neutral-950 border-t border-white/5 flex gap-3 text-left">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder="메시지를 입력하세요..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-purple-600 text-white font-bold transition-all shadow-inner" />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="p-3 bg-purple-600 text-white rounded-xl shadow-lg flex items-center justify-center shrink-0 text-white shadow-purple-600/20"><Send size={24} /></button>
          </div>
        </motion.div>
      )}</AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="w-20 h-20 rounded-[30px] bg-purple-600 shadow-2xl flex items-center justify-center text-white hover:scale-110 duration-500 shadow-purple-600/30">{isOpen ? <X size={32} /> : <MessageCircle size={32} />}</button>
    </div>
  );
}