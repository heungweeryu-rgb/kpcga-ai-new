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

// === Firebase 설정 (Vercel 환경변수 사용) ===
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 유흥위 선생님의 실제 주소(kpca.vercel.app)와 연결된 프로젝트 ID입니다.
const appId = 'kpcga-ai-new-g1az';

// === Gemini AI 설정 ===
const genAI = new GoogleGenerativeAI(""); 

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  const [requests, setRequests] = useState([]);
  const [notice, setNotice] = useState({ content: "환영합니다. 한국심리상담지도협회(KPCGA)입니다." });
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [editedNotice, setEditedNotice] = useState("");

  const [newRequest, setNewRequest] = useState({ title: "", details: "" });
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");

  // 1. 인증 처리
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 2. 실시간 데이터 연결
  useEffect(() => {
    if (!user) return;

    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
    const q = query(requestsRef, orderBy('timestamp', 'desc'));
    
    const unsubRequests = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    }, (err) => console.error("데이터 로드 에러:", err));

    const noticeRef = doc(db, 'artifacts', appId, 'public', 'data', 'notice', 'current');
    const unsubNotice = onSnapshot(noticeRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNotice(data);
        setEditedNotice(data.content);
      }
    }, (err) => console.error("공지사항 에러:", err));

    return () => {
      unsubRequests();
      unsubNotice();
    };
  }, [user]);

  // 3. 상담 신청
  const submitRequest = async (e) => {
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
        userId: user.uid
      });
      setNewRequest({ title: "", details: "" });
      alert("상담 신청이 성공적으로 접수되었습니다.");
    } catch (err) {
      console.error(err);
      alert("전송 중 오류가 발생했습니다.");
    }
  };

  // 4. 공지사항 수정
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
      alert("수정 권한이 없습니다.");
    }
  };

  // 5. 관리자 로그인
  const handleAdminLogin = () => {
    if (adminPassword === "1234") { 
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      alert("상담사 모드가 활성화되었습니다.");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  // 6. AI 상담
  const askAi = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiMessage("");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `당신은 한국심리상담지도협회(KPCGA)의 전문 상담사입니다. 따뜻하고 전문적인 조언을 해주세요: ${aiInput}`;
      const result = await model.generateContent(prompt);
      setAiMessage(result.response.text());
    } catch (err) {
      setAiMessage("상담사가 잠시 자리를 비웠습니다. 잠시 후 다시 시도해 주세요.");
    }
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans">
      <nav className="border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold block">KPCGA AI</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Counseling Center</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <button onClick={() => setIsAdmin(false)} className="flex items-center gap-2 bg-rose-500/10 text-rose-400 px-5 py-2 rounded-xl text-sm font-bold border border-rose-500/20">
                <LogOut size={18} /> 로그아웃
              </button>
            ) : (
              <button onClick={() => setShowAdminLogin(true)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white bg-white/5 rounded-2xl border border-white/5">
                <Settings size={22} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <section className={`rounded-[2rem] p-8 border ${isAdmin ? 'bg-indigo-600/10 border-indigo-500/40' : 'bg-slate-900/40 border-white/5'}`}>
          <div className="flex items-start gap-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
              <Bell size={24} />
            </div>
            <div className="flex-grow">
              <h3 className="text-xs font-bold text-indigo-400 uppercase mb-2">Notice</h3>
              {isEditingNotice && isAdmin ? (
                <div className="space-y-4 mt-2">
                  <textarea 
                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-2xl p-5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    value={editedNotice}
                    onChange={(e) => setEditedNotice(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={saveNotice} className="bg-indigo-600 px-6 py-2 rounded-xl text-sm font-bold">저장</button>
                    <button onClick={() => setIsEditingNotice(false)} className="bg-slate-800 px-6 py-2 rounded-xl text-sm font-bold">취소</button>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-slate-100 font-medium leading-relaxed">{notice.content}</p>
              )}
            </div>
            {isAdmin && !isEditingNotice && (
              <button onClick={() => setIsEditingNotice(true)} className="text-indigo-400 hover:text-white"><Edit3 size={20} /></button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="space-y-12">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 shadow-xl">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-500"><Edit3 size={28} /> <span>상담 신청하기</span></h2>
              <form onSubmit={submitRequest} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">상담 제목 (리스트 공개)</label>
                  <input 
                    type="text"
                    placeholder="제목을 입력하세요"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-400 uppercase mb-2 ml-1">상세 고민 내용 (상담사만 확인 - 비밀보호)</label>
                  <textarea 
                    placeholder="상세 내용을 입력하세요. 다른 방문자에게는 보이지 않습니다."
                    rows={5}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={newRequest.details}
                    onChange={(e) => setNewRequest({...newRequest, details: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20">신청 완료</button>
              </form>
            </div>

            <div className="bg-slate-900/40 border border-indigo-500/20 rounded-[2.5rem] p-10 shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-4"><div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center italic text-white text-xs font-black">AI</div> AI 즉석 상담</h2>
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="지금 기분을 말해보세요..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 pr-16 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAi()}
                  />
                  <button onClick={askAi} className="absolute right-2 top-2 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500"><Send size={20} /></button>
                </div>
                {isAiLoading && <div className="text-center text-indigo-400 animate-pulse">답변을 생각 중입니다...</div>}
                {aiMessage && !isAiLoading && <div className="bg-indigo-600/10 rounded-3xl p-8 border border-indigo-500/20 text-slate-200 leading-relaxed whitespace-pre-wrap">{aiMessage}</div>}
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-indigo-500"><User size={28} /> <span>실시간 접수 현황</span></h2>
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
              {requests.length === 0 ? (
                <div className="text-center py-32 text-slate-700 border-2 border-dashed border-white/5 rounded-[3rem]">접수된 상담이 없습니다.</div>
              ) : (
                requests.map((req) => (
                  <motion.div key={req.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-slate-900/50 border rounded-3xl p-8 transition-all ${isAdmin ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/5'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-400">{req.status}</span>
                          <span className="text-[10px] text-slate-500">{new Date(req.timestamp).toLocaleString()}</span>
                        </div>
                        <h4 className="text-xl font-bold">{req.title}</h4>
                      </div>
                      {isAdmin && <CheckCircle className="text-indigo-500" size={24} />}
                    </div>

                    {isAdmin ? (
                      <div className="mt-6 p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                        <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Eye size={14} /> 상담 상세 내용</h5>
                        <p className="text-slate-200 text-sm whitespace-pre-wrap">{req.details}</p>
                      </div>
                    ) : (
                      <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center gap-3 text-slate-600 text-center">
                        <Lock size={16} /><p className="text-[11px] font-bold">상세 고민 내용은 상담사에게만 안전하게 보호됩니다.</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowAdminLogin(false)}></div>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0a0c10] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md relative z-10 shadow-2xl text-center">
              <h3 className="text-2xl font-bold mb-8">상담사 로그인</h3>
              <input 
                type="password" 
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-8 text-center text-3xl tracking-[0.5em] outline-none"
                placeholder="••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                autoFocus
              />
              <button onClick={handleAdminLogin} className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500">입장하기</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto px-6 py-20 text-center text-slate-600 text-xs border-t border-white/5 mt-24">
        <p className="font-bold mb-2">© 2026 KPCGA 한국심리상담지도협회. All Rights Reserved.</p>
        <p className="opacity-50 tracking-widest">Designed & Developed by Heung-wei Ryu</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default App;