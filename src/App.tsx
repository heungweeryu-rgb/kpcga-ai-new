<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2026 KPCGA AI 심리상담 임팩트 리포트</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #F8FAFC;
            color: #1E293B;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            height: 350px;
            max-height: 400px;
        }
        @media (min-width: 768px) {
            .chart-container {
                height: 400px;
            }
        }
        .card {
            background: white;
            border-radius: 1.5rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body class="antialiased selection:bg-[#0D9488]/20">

<!-- 
    PALETTE SELECTION: "Energetic Teal & Vibrant Coral"
    Primary: #0D9488 (Teal)
    Secondary: #F97316 (Coral)
    Accent: #4F46E5 (Indigo)
    Background: #F8FAFC (Light Slate)
-->

<!-- 
    CONSTRAINT CONFIRMATION:
    - NO SVG graphics are used in this output.
    - NO Mermaid JS is used in this output.
-->

<!--
    NARRATIVE & STRUCTURE PLAN:
    1. Header: Contextualizes the 2026 Impact Report for KPCGA.
    2. Core KPIs: Displays top-level metrics (Counseling count, response time, satisfaction).
    3. Categorical Distribution: Shows what issues people bring to the AI.
    4. Satisfaction Analysis: Compares satisfaction rates across different age groups.
    5. Temporal Trends: Visualizes the growth of AI-first counseling over 18 months.
    6. System Flow: A structured CSS layout representing the "Intake to Human" process.
-->

<!--
    VISUALIZATION CHOICES:
    - KPI Metrics -> BIG NUMBERS (HTML/CSS) -> Direct impact communication. (NO SVG)
    - Counseling Topics -> DONUT CHART (Chart.js) -> Ideal for showing parts of a whole across 5 issues. (NO SVG)
    - Demographic Satisfaction -> BAR CHART (Chart.js) -> Direct comparison across age categories. (NO SVG)
    - Adoption Trend -> AREA CHART (Chart.js) -> Highlights volume and trajectory over time. (NO SVG)
    - Process Flow -> FLEXBOX STEPPER (HTML/CSS) -> Shows relationships without complex diagramming tools. (NO SVG)
-->

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    <header class="text-center mb-16 bg-gradient-to-br from-[#4F46E5] to-[#0D9488] rounded-[3rem] p-12 shadow-2xl text-white relative overflow-hidden">
        <div class="relative z-10">
            <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">KPCGA AI 심리상담 솔루션<br>2026 임팩트 리포트</h1>
            <p class="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto">한국심리상담지도협회(KPCGA)가 구축한 혁신적 디지털 상담 체계의 성과와 미래 가치를 데이터로 분석합니다.</p>
        </div>
        <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
    </header>

    <section class="mb-16">
        <h2 class="text-3xl font-extrabold text-[#1E293B] mb-4 border-l-8 border-[#F97316] pl-4">핵심 성과 지표 (KPIs)</h2>
        <p class="text-lg text-slate-600 mb-8 max-w-4xl">AI 상담 솔루션 도입 이후 지난 1년간의 가시적인 변화입니다. 24시간 실시간 대응 체계를 구축함으로써 내담자의 접근성을 극대화하고 상담 사각지대를 해소했습니다.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card p-8 text-center transform transition duration-500 hover:-translate-y-2 border-t-4 border-[#0D9488]">
                <p class="text-slate-500 text-sm font-black uppercase tracking-widest mb-2">누적 상담 건수</p>
                <p class="text-5xl font-black text-[#0D9488]">124,500<span class="text-2xl">건+</span></p>
                <p class="text-sm text-slate-400 mt-2">전년 대비 320% 증가</p>
            </div>
            <div class="card p-8 text-center transform transition duration-500 hover:-translate-y-2 border-t-4 border-[#F97316]">
                <p class="text-slate-500 text-sm font-black uppercase tracking-widest mb-2">평균 응답 지연</p>
                <p class="text-5xl font-black text-[#F97316]">1.2<span class="text-2xl">초</span></p>
                <p class="text-sm text-slate-400 mt-2">대기 시간 제로화 달성</p>
            </div>
            <div class="card p-8 text-center transform transition duration-500 hover:-translate-y-2 border-t-4 border-[#4F46E5]">
                <p class="text-slate-500 text-sm font-black uppercase tracking-widest mb-2">상담 만족도</p>
                <p class="text-5xl font-black text-[#4F46E5]">94<span class="text-2xl">%</span></p>
                <p class="text-sm text-slate-400 mt-2">긍정 피드백 비율</p>
            </div>
        </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        <section class="card p-8 md:p-10">
            <h2 class="text-2xl font-bold text-[#1E293B] mb-4">주요 상담 주제 분포</h2>
            <p class="text-slate-600 mb-8 leading-relaxed">내담자들이 AI 솔루션을 통해 가장 많이 토로하는 고민의 유형입니다. 직장 내 스트레스와 대인관계 갈등이 전체의 절반 이상을 차지하며, 현대인의 주요 결핍을 명확히 보여줍니다.</p>
            <div class="chart-container">
                <canvas id="topicsChart"></canvas>
            </div>
            <div class="mt-8 p-4 bg-[#F8FAFC] rounded-xl text-sm text-slate-500 italic">
                * KPCGA 익명 데이터 기반 분석 (2025-2026)
            </div>
        </section>

        <section class="card p-8 md:p-10">
            <h2 class="text-2xl font-bold text-[#1E293B] mb-4">세대별 AI 상담 신뢰도</h2>
            <p class="text-slate-600 mb-8 leading-relaxed">연령대별 AI 상담 답변에 대한 신뢰 및 만족 점수(100점 만점)입니다. 디지털 네이티브 세대(2030)뿐만 아니라, 비대면 상담의 익명성을 선호하는 4050 세대에서도 높은 만족도를 기록했습니다.</p>
            <div class="chart-container">
                <canvas id="demographicsChart"></canvas>
            </div>
            <div class="mt-8 grid grid-cols-2 gap-4">
                <div class="p-4 bg-[#0D9488]/5 rounded-xl border border-[#0D9488]/20 text-center">
                    <p class="text-xs font-bold text-[#0D9488] mb-1">최고 만족 세대</p>
                    <p class="text-xl font-black text-[#1E293B]">20대 (96점)</p>
                </div>
                <div class="p-4 bg-[#F97316]/5 rounded-xl border border-[#F97316]/20 text-center">
                    <p class="text-xs font-bold text-[#F97316] mb-1">최다 이용 증가</p>
                    <p class="text-xl font-black text-[#1E293B]">40대 (+15%)</p>
                </div>
            </div>
        </section>

    </div>

    <section class="bg-[#1E293B] text-white rounded-[3rem] p-8 md:p-16 shadow-2xl mb-16 relative overflow-hidden">
        <h2 class="text-3xl font-extrabold mb-6 border-l-8 border-[#0D9488] pl-6">상담 방식의 전환 트렌드 (2025-2026)</h2>
        <p class="text-slate-300 mb-12 max-w-4xl text-lg leading-relaxed">지난 1년 6개월간의 접수 데이터를 비교 분석한 결과입니다. 초기에는 인간 상담사와의 직접 연결을 선호했으나, AI 시스템 고도화 이후 'AI 1차 스크리닝'을 통한 상담이 폭발적으로 증가하며 효율성을 입증했습니다.</p>
        <div class="chart-container" style="max-width: 1000px; height: 400px;">
            <canvas id="trendChart"></canvas>
        </div>
        <div class="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl tracking-tighter select-none">DATA</div>
    </section>

    <section class="card p-8 md:p-16 mb-16 border border-slate-100">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-extrabold text-[#1E293B] mb-4 text-center">KPCGA AI 세이프티 프로세스</h2>
            <p class="text-slate-600 mb-16 text-center text-lg leading-relaxed">내담자가 사이트에 접속하여 고민을 남기는 순간부터 전문 상담사에게 안전하게 이관되기까지의 체계적인 흐름도입니다.</p>
            
            <div class="flex flex-col md:flex-row items-stretch justify-between gap-4">
                <div class="flex-1 bg-slate-50 rounded-2xl p-6 text-center border-2 border-slate-100 relative shadow-sm">
                    <div class="text-4xl mb-4">💬</div>
                    <h3 class="font-black text-[#1E293B] mb-2 uppercase text-xs tracking-widest">STEP 01</h3>
                    <p class="font-bold text-[#4F46E5] mb-2">고민 접수</p>
                    <p class="text-xs text-slate-500">내담자가 제목과 상세 내용을 시스템에 입력</p>
                </div>

                <div class="flex items-center justify-center text-[#4F46E5] text-2xl rotate-90 md:rotate-0">➔</div>

                <div class="flex-1 bg-[#0D9488] rounded-2xl p-6 text-center border-2 border-[#0D9488] relative shadow-lg transform md:scale-110">
                    <div class="text-4xl mb-4">🧠</div>
                    <h3 class="font-black text-teal-100 mb-2 uppercase text-xs tracking-widest">STEP 02</h3>
                    <p class="font-bold text-white mb-2">AI 스크리닝</p>
                    <p class="text-xs text-teal-50 text-opacity-80">위험도 분석 및 1차적 공감·조언 즉각 제공</p>
                </div>

                <div class="flex items-center justify-center text-[#4F46E5] text-2xl rotate-90 md:rotate-0">➔</div>

                <div class="flex-1 bg-slate-50 rounded-2xl p-6 text-center border-2 border-slate-100 relative shadow-sm">
                    <div class="text-4xl mb-4">🛡️</div>
                    <h3 class="font-black text-[#1E293B] mb-2 uppercase text-xs tracking-widest">STEP 03</h3>
                    <p class="font-bold text-[#F97316] mb-2">데이터 보안</p>
                    <p class="text-xs text-slate-500">상세 내용은 암호화되어 관리자 포털로 안전 이관</p>
                </div>

                <div class="flex items-center justify-center text-[#4F46E5] text-2xl rotate-90 md:rotate-0">➔</div>

                <div class="flex-1 bg-slate-900 rounded-2xl p-6 text-center border-2 border-slate-800 relative shadow-xl">
                    <div class="text-4xl mb-4">👨‍⚕️</div>
                    <h3 class="font-black text-slate-500 mb-2 uppercase text-xs tracking-widest">STEP 04</h3>
                    <p class="font-bold text-white mb-2">전문가 매칭</p>
                    <p class="text-xs text-slate-400">인간 상담사가 상세 확인 후 심층 상담 진행</p>
                </div>
            </div>
        </div>
    </section>

    <footer class="text-center py-12 text-slate-400 text-sm border-t border-slate-200">
        <p class="font-black mb-1 uppercase tracking-widest text-[#1E293B]/30">© 2026 KPCGA 한국심리상담지도협회. All Rights Reserved.</p>
        <p class="mb-4">본 리포트는 AI 상담 솔루션의 사회적 임팩트를 시각화하기 위해 제작되었습니다.</p>
        <div class="flex justify-center gap-6">
            <span class="hover:text-[#0D9488] cursor-pointer">이용약관</span>
            <span class="hover:text-[#0D9488] cursor-pointer">개인정보처리방침</span>
            <span class="hover:text-[#0D9488] cursor-pointer">협회소개</span>
        </div>
    </footer>

</div>

<script>
    /**
     * Requirement: Label Wrapping Logic (16 chars)
     */
    function wrapLabel(text, maxChars) {
        if (text.length <= maxChars) return text;
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length > maxChars) {
                if (currentLine) lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });
        if (currentLine) lines.push(currentLine.trim());
        return lines;
    }

    /**
     * Requirement: Tooltip Configuration
     */
    const baseTooltipConfig = {
        callbacks: {
            title: function(tooltipItems) {
                const item = tooltipItems[0];
                let label = item.chart.data.labels[item.dataIndex];
                if (Array.isArray(label)) {
                    return label.join(' ');
                } else {
                    return label;
                }
            }
        }
    };

    // 1. Topic Donut Chart
    const topicsRaw = ['직장 내 스트레스 및 번아웃', '가족 및 부부관계 갈등', '진로 및 미래 불안', '자존감 저하 및 우울', '기타 심리적 어려움'];
    const topicsWrapped = topicsRaw.map(l => wrapLabel(l, 16));

    const ctxTopics = document.getElementById('topicsChart').getContext('2d');
    new Chart(ctxTopics, {
        type: 'doughnut',
        data: {
            labels: topicsWrapped,
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: ['#0D9488', '#4F46E5', '#F97316', '#38BDF8', '#94A3B8'],
                hoverOffset: 20,
                borderWidth: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { weight: 'bold' }, padding: 20 } },
                tooltip: baseTooltipConfig
            },
            cutout: '70%'
        }
    });

    // 2. Demographic Bar Chart
    const demoRaw = ['10대 (청소년)', '20대 (청년)', '30대 (사회초년생)', '40대 (중년)', '50대 이상 (시니어)'];
    const demoWrapped = demoRaw.map(l => wrapLabel(l, 16));

    const ctxDemo = document.getElementById('demographicsChart').getContext('2d');
    new Chart(ctxDemo, {
        type: 'bar',
        data: {
            labels: demoWrapped,
            datasets: [{
                label: '만족 점수',
                data: [88, 96, 92, 85, 82],
                backgroundColor: '#0D9488',
                borderRadius: 12
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: baseTooltipConfig
            },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: '#F1F5F9' } },
                x: { grid: { display: false } }
            }
        }
    });

    // 3. Trend Area Chart
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['25년 1Q', '25년 2Q', '25년 3Q', '25년 4Q', '26년 1Q', '26년 2Q'],
            datasets: [
                {
                    label: 'AI 1차 상담 접수',
                    data: [5000, 12000, 28000, 52000, 89000, 124500],
                    borderColor: '#0D9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.2)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 6,
                    pointBackgroundColor: '#0D9488'
                },
                {
                    label: '상담사 직접 연결 요청',
                    data: [15000, 15500, 14800, 14000, 13200, 12800],
                    borderColor: '#F97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 6,
                    pointBackgroundColor: '#F97316'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#F8FAFC', font: { weight: 'bold' } } },
                tooltip: baseTooltipConfig
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94A3B8' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#94A3B8' }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
</script>
</body>
</html>