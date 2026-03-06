
import React, { useState } from 'react';
import { UserProfile, SkillLevel, RidingStyle, WaveType, AdvisorResult, Recommendation } from './types';
import { getLongboardRecommendation, getSpecificBoardAnalysis } from './services/geminiService';

const Header: React.FC = () => (
  <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase italic">SurfLens <span className="text-indigo-400">AI</span></span>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Personalized Advisor</p>
        </div>
      </div>
      <div className="hidden md:flex space-x-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <a href="#" className="hover:text-white transition">My Page</a>
        <a href="#" className="hover:text-white transition">Quiver Analysis</a>
        <a href="#" className="hover:text-white transition">History</a>
      </div>
    </div>
  </header>
);

const SpecBadge: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="text-sm font-extrabold text-slate-900">{value}</p>
  </div>
);

const PrescriptionCard: React.FC<{ rec: Recommendation; index: number }> = ({ rec, index }) => (
  <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
    <div className="bg-slate-900 p-6 flex justify-between items-center">
      <div>
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Board Prescription #{index + 1}</span>
        <h3 className="text-xl font-black text-white mt-1">{rec.brand}</h3>
        <p className="text-indigo-200 text-sm font-bold">{rec.modelName}</p>
      </div>
      <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-white font-black text-xl italic">
        0{index + 1}
      </div>
    </div>
    
    <div className="p-8 flex-grow">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <SpecBadge label="DIM" value={rec.specs.length} />
        <SpecBadge label="Volume" value={rec.specs.volume} />
        <SpecBadge label="Rail" value={rec.specs.rail} />
        <SpecBadge label="Rocker" value={rec.specs.rocker} />
        <SpecBadge label="Width" value={rec.specs.width} />
        <SpecBadge label="Thickness" value={rec.specs.thickness} />
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span> Technical Analysis
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">{rec.reason}</p>
        </div>
      </div>
    </div>
  </div>
);

const DonationCard: React.FC = () => (
  <div className="bg-gradient-to-br from-indigo-600 to-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden mt-12">
    <div className="absolute top-0 right-0 p-8 opacity-10">
      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
    <div className="relative z-10">
      <h3 className="text-2xl font-black tracking-tight mb-4">SurfLens AI를 응원해주세요! 🌊</h3>
      <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-8 max-w-lg">
        SurfLens AI가 당신의 인생 보드를 찾는 데 도움이 되었나요? 이 서비스는 서퍼들의 따뜻한 후원으로 운영됩니다. 
        커피 한 잔으로 더 똑똑하고 정교한 AI 어드바이저를 응원해주세요!
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="https://qr.kakaopay.com/FKzFA37g5" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-yellow-400 text-slate-900 font-black rounded-xl uppercase tracking-widest text-xs hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">☕ 카카오페이 후원</a>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [boardQuery, setBoardQuery] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    height: 175,
    weight: 70,
    gender: 'MALE',
    skill: SkillLevel.BEGINNER,
    style: RidingStyle.ALL_ROUNDER,
    waveType: WaveType.MIXED,
    preferredLocation: '',
    currentSkills: '',
    desiredTechniques: '',
    currentBoard: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setQueryResult(null);
    try {
      const data = await getLongboardRecommendation(profile);
      setResult(data);
    } catch (err) {
      alert("데이터 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBoardQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardQuery.trim()) return;
    setQueryLoading(true);
    try {
      const response = await getSpecificBoardAnalysis(profile, boardQuery);
      setQueryResult(response);
    } catch (err) {
      alert("보드 분석 중 오류가 발생했습니다.");
    } finally {
      setQueryLoading(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-900 selection:bg-indigo-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Dashboard Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tighter text-slate-900">Surfer Profile</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">개인화 어드바이저 설정</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">성별</label>
                    <select value={profile.gender} onChange={(e) => updateProfile('gender', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black focus:border-indigo-500 outline-none transition">
                      <option value="MALE">남성</option>
                      <option value="FEMALE">여성</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">키 (cm)</label>
                    <input type="number" value={profile.height} onChange={(e) => updateProfile('height', parseInt(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black focus:border-indigo-500 outline-none transition" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">체중 (kg)</label>
                    <input type="number" value={profile.weight} onChange={(e) => updateProfile('weight', parseInt(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">지향 스타일</label>
                    <select value={profile.style} onChange={(e) => updateProfile('style', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black focus:border-indigo-500 outline-none transition">
                      <option value={RidingStyle.CLASSIC}>CLASSIC</option>
                      <option value={RidingStyle.PERFORMANCE}>PERFORMANCE</option>
                      <option value={RidingStyle.ALL_ROUNDER}>ALL-ROUNDER</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">현재 실력 (구체적)</label>
                  <input type="text" placeholder="예: 사이드라이딩 가능, 로깅 원스텝 시도 중 등" value={profile.currentSkills} onChange={(e) => updateProfile('currentSkills', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 outline-none transition" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">타겟 로케이션 스팟</label>
                  <input type="text" placeholder="제주 중문, 부산 송정, 포항 신항만, 만리포 등" value={profile.preferredLocation} onChange={(e) => updateProfile('preferredLocation', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black focus:border-indigo-500 outline-none transition" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">보유 중인 보드 (선택)</label>
                  <input type="text" placeholder="예: CJ Nelson Outlier 9'0" value={profile.currentBoard} onChange={(e) => updateProfile('currentBoard', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 outline-none transition" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">희망하는 기술</label>
                  <textarea 
                    placeholder="행파이브, 컷백, 안정적인 패들링 등" 
                    value={profile.desiredTechniques} 
                    onChange={(e) => updateProfile('desiredTechniques', e.target.value)} 
                    rows={2}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 outline-none transition resize-none"
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 hover:shadow-indigo-200 transition-all duration-300 disabled:opacity-50 group flex items-center justify-center space-x-3 mt-4"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Get Personalized Report</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-8">
            {!result && !loading && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20">
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Ready for Analysis</h3>
                <p className="text-slate-400 mt-4 font-bold max-w-sm mx-auto">프로필과 로케이션을 선택하면 AI 어드바이저가 개인화된 리포트를 생성합니다.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-10">
                <div className="h-64 bg-white animate-pulse rounded-[3rem] border border-slate-200"></div>
                <div className="h-[400px] bg-white animate-pulse rounded-[3rem] border border-slate-200"></div>
              </div>
            )}

            {result && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                
                {/* My Page Report Section */}
                <section className="grid md:grid-cols-2 gap-8">
                  <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">My Progress</h4>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{result.myProgress?.badge}</span>
                    </div>
                    <h2 className="text-2xl font-black mb-4">내 실력 성장 리포트</h2>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed">{result.myProgress?.points}</p>
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Quiver Check</h4>
                      <div className="text-2xl font-black text-indigo-600">{result.quiverCheck?.score}<span className="text-xs text-slate-400 ml-1">/100</span></div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">현재 장비 진단</h2>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{result.quiverCheck?.analysis}</p>
                  </div>
                </section>

                {/* Local Spot & Diagnosis */}
                <section className="bg-slate-900 text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 grid md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Expert Diagnosis</h4>
                      <h2 className="text-2xl font-black leading-snug italic">"{result.diagnosis}"</h2>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Spot Context ({profile.preferredLocation})</h4>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed">{result.localTrend}</p>
                    </div>
                  </div>
                </section>

                {/* Prescription Grid */}
                <div>
                  <div className="flex items-center justify-between mb-8 px-4">
                    <h2 className="text-3xl font-black tracking-tighter">AI Next Step Wishlist</h2>
                    <div className="h-0.5 flex-grow mx-8 bg-slate-200 hidden md:block"></div>
                    <span className="bg-indigo-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Top Matches</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {result.recommendations.map((rec, i) => (
                      <PrescriptionCard key={i} rec={rec} index={i} />
                    ))}
                  </div>
                </div>

                {/* Custom Board Search Section */}
                <div className="bg-white border-2 border-indigo-100 rounded-[2.5rem] p-10 shadow-sm">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-black">?</div>
                    이 보드는 어때? (특정 모델 분석)
                  </h4>
                  <form onSubmit={handleBoardQuerySubmit} className="flex gap-3 mb-6">
                    <input 
                      type="text" 
                      placeholder="궁금한 보드 이름을 입력하세요 (예: Firewire Special T)" 
                      value={boardQuery}
                      onChange={(e) => setBoardQuery(e.target.value)}
                      className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm focus:border-indigo-500 outline-none transition shadow-inner"
                    />
                    <button 
                      type="submit"
                      disabled={queryLoading}
                      className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                    >
                      {queryLoading ? '분석 중...' : '분석하기'}
                    </button>
                  </form>

                  {queryResult && (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 animate-in fade-in slide-in-from-top-4">
                      <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Custom Analysis Result</h5>
                      <p className="text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-line italic">"{queryResult}"</p>
                    </div>
                  )}
                </div>

                {/* Expert Advice Summary */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-black">AI</div>
                    Final Tech Advice
                  </h4>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line">{result.expertAdvice}</p>
                </div>

                {/* Donation Section */}
                <DonationCard />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">SurfLens AI © 2024 • Personalized Advisor Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
