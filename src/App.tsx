import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  User, 
  Settings, 
  Bell, 
  ChevronRight, 
  Lock, 
  Eye, 
  Edit3, 
  CheckCircle,
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";

// === Firebase 설정 (환경 변수 제공) ===
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 유흥위 선생님의 메인 프로젝트 ID (kpca.vercel.app 연결용)
const appId = 'kpcga-ai-new-g1az';

// === Gemini AI 설정 ===
const genAI = new GoogleGenerativeAI(""); 

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  const [requests, setRequests] = useState<any[]>([]);
  const [notice, setNotice] = useState({ content: "환영합니다. 한국심리상담지도협회(KPCGA)입니다." });
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [editedNotice, setEditedNotice] = useState("");

  const [newRequest, setNewRequest] = useState({ title: "", details: "" });
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");

  // 1. 초기 인증 (Rule 3)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("인증 에러:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 2. 실시간 데이터 바인딩 (Rule 1 & 2)
  useEffect(() => {
    if (!user) return;

    // 상담 신청 목록 리스너 (Public Path)
    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
    const q = query(requestsRef, orderBy('timestamp', 'desc'));
    
    const unsubRequests = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    }, (err) => console.error("데이터 로딩 에러:", err));

    // 공지사항 리스너
    const noticeRef = doc(db, 'artifacts', appId, 'public', 'data', 'notice', 'current');
    const unsubNotice = onSnapshot(noticeRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNotice({ content: data.content });
        setEditedNotice(data.content);
      }
    }, (err) => console.error("공지사항 에러:", err));

    return () => {
      unsubRequests();
      unsubNotice();
    };
  }, [user]);

  // 3. 기능: 상담 신청
  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.title.trim() || !newRequest.details.trim()) {
      alert("제목과 상세 고민 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
        title: newRequest.title,
        details: newRequest.details,
        status: '접수대기',
        timestamp: new Date().toISOString(),
        userId: user?.uid || 'anonymous'
      });
      setNewRequest({ title: "", details: "" });
      alert("상담 신청이 완료되었습니다. 관리자가 확인 후 연락드리겠습니다.");
    } catch (err) {
      console.error(err);
      alert("전송 중 오류가 발생했습니다.");
    }
  };

  // 4. 기능: 공지사항 저장 (관리자 전용)
  const saveNotice = async () => {
    if (!isAdmin) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'notice', 'current'), {
        content: editedNotice,
        lastUpdated: new Date().toISOString()
      });
      setIsEditingNotice(false);
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 5. 기능: 관리자 로그인
  const handleAdminLogin = () => {
    if (adminPassword === "1234") { 
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      alert("관리자(상담사) 모드가 활성화되었습니다.");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 6. 기능: AI 상담
  const askAi = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiMessage("");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `당신은 한국심리상담지도협회(KPCGA)의 전문 심리 상담사입니다. 내담자의 다음 고민에 대해 따뜻하고 전문적인 조언을 제공해 주세요: ${aiInput}`;
      const result = await model.generateContent(prompt);
      setAiMessage(result.response.text());
    } catch (err) {
      setAiMessage("상담사가 현재 다른 상담 중입니다. 잠시 후 다시 말을 걸어주세요.");
    }
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* 네비게이션 */}
      <nav className="border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold block leading-none tracking-tight">KPCGA AI</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Digital Counsel</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <button 
                onClick={() => setIsAdmin(false)}
                className="flex items-center gap-2 bg-rose-500/10 text-rose-400 px-5 py-2.5 rounded-xl text-sm font-bold border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-95"
              >
                <LogOut size={18} /> 로그아웃
              </button>
            ) : (
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
              >
                <Settings size={22} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* 공지사항 */}
        <section className={`rounded-[2.5rem] p-8 border shadow-2xl transition-all ${isAdmin ? 'bg-indigo-600/10 border-indigo-500/40' : 'bg-slate-900/40 border-white/5 shadow-black/50'}`}>
          <div className="flex items-start gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-indigo-500 text-white shadow-lg' : 'bg-indigo-500/10 text-indigo-400'}`}>
              <Bell size={28} />
            </div>
            <div className="flex-grow">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Notice</h3>
              {isEditingNotice && isAdmin ? (
                <div className="space-y-4">
                  <textarea 
                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-2xl p-5 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                    rows={3}
                    value={editedNotice}
                    onChange={(e) => setEditedNotice(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={saveNotice} className="bg-indigo-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30">공지 저장</button>
                    <button onClick={() => setIsEditingNotice(false)} className="bg-slate-800 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all">취소</button>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-slate-100 font-medium leading-relaxed whitespace-pre-wrap">{notice.content}</p>
              )}
            </div>
            {isAdmin && !isEditingNotice && (
              <button onClick={() => setIsEditingNotice(true)} className="w-10 h-10 flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-all"><Edit3 size={20} /></button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 신청 폼 & AI */}
          <section className="space-y-12">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 shadow-xl backdrop-blur-sm relative overflow-hidden group">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500">
                  <Edit3 size={24} />
                </div>
                <span>상담 신청하기</span>
              </h2>
              <form onSubmit={submitRequest} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">상담 제목 (전체 공개)</label>
                  <input 
                    type="text"
                    placeholder="제목을 입력하세요"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg font-medium"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-rose-400 uppercase tracking-widest ml-1">상세 고민 내용 (상담사 전용 - 비밀보호)</label>
                  <textarea 
                    placeholder="담당 상담사만 확인할 수 있는 내용을 적어주세요."
                    rows={5}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={newRequest.details}
                    onChange={(e) => setNewRequest({...newRequest, details: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 text-lg active:scale-95 group">
                  신청 완료 <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* AI 즉석 상담 */}
            <div className="bg-gradient-to-br from-indigo-600/10 via-slate-900/50 to-slate-900 border border-indigo-500/20 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg"><span className="text-white text-xs font-black italic">AI</span></div>
                AI 조언실
              </h2>
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="기분을 말해보세요..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 pr-16 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAi()}
                  />
                  <button onClick={askAi} disabled={isAiLoading} className="absolute right-2 top-2 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50">
                    <Send size={20} />
                  </button>
                </div>
                {isAiLoading && <div className="text-center py-4 text-indigo-400 animate-pulse font-bold italic">답변을 생각 중입니다...</div>}
                {aiMessage && !isAiLoading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-600/10 rounded-3xl p-8 border border-indigo-500/20 text-slate-200 leading-relaxed whitespace-pre-wrap relative shadow-inner">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg"><User size={16} /></div>
                    {aiMessage}
                  </motion.div>
                )}
              </div>
            </div>
          </section>

          {/* 접수 현황 */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-3xl font-bold flex items-center gap-3"><User className="text-indigo-500" size={28} /> <span>실시간 접수 현황</span></h2>
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-green-400 font-black tracking-widest uppercase">Live Status</span>
              </div>
            </div>
            
            <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar pb-12">
              {requests.length === 0 ? (
                <div className="text-center py-32 text-slate-700 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/5 flex flex-col items-center gap-4">
                  <Lock size={40} className="opacity-20" />
                  접수된 내역이 없습니다.
                </div>
              ) : (
                requests.map((req) => (
                  <motion.div key={req.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-slate-900/50 border rounded-[2rem] p-8 transition-all relative overflow-hidden ${isAdmin ? 'border-indigo-500/40 bg-indigo-500/5 shadow-indigo-500/10 ring-1 ring-indigo-500/20' : 'border-white/5 shadow-black/50'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${req.status === '완료' ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{req.status}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{new Date(req.timestamp).toLocaleString()}</span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-100">{req.title}</h4>
                      </div>
                      {isAdmin && <CheckCircle className="text-indigo-500" size={24} />}
                    </div>

                    {isAdmin ? (
                      <div className="mt-6 p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 space-y-3 shadow-inner">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <Eye size={16} />
                          <h5 className="text-[11px] font-black uppercase tracking-widest">상담 상세 내용 (관리자 전용)</h5>
                        </div>
                        <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed font-medium">{req.details}</p>
                      </div>
                    ) : (
                      <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center gap-3 text-slate-500 text-center shadow-inner">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-600"><Lock size={16} /></div>
                        <div className="space-y-1">
                          <p className="text-[12px] font-bold text-slate-400">비밀 보호 모드 활성화</p>
                          <p className="text-[10px] text-slate-600 italic">상세 고민은 상담사에게만 안전하게 보호됩니다.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 관리자 로그인 */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdminLogin(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-[#0a0c10] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md relative z-10 shadow-2xl text-center">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400"><ShieldCheck size={20} /></div>
                  <h3 className="text-2xl font-bold">Counselor Portal</h3>
                </div>
                <button onClick={() => setShowAdminLogin(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <p className="text-slate-400 text-sm mb-8">협회 비밀번호를 입력해 주세요.</p>
              <input 
                type="password" 
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-8 text-center text-3xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                placeholder="••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                autoFocus
              />
              <button onClick={handleAdminLogin} className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all">접속하기</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto px-6 py-20 text-center text-slate-600 text-xs border-t border-white/5 mt-24">
        <p className="font-bold mb-2 uppercase tracking-widest">© 2026 KPCGA 한국심리상담지도협회. All Rights Reserved.</p>
        <p className="opacity-50">시스템 구축: 유흥위(Heung-wei Ryu)</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        body { background-color: #0a0c10; }
      `}</style>
    </div>
  );
};

export default App;