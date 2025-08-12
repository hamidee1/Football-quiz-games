// script.js (Completely Restructured for Game Stages with Full Question Bank)

document.addEventListener('DOMContentLoaded', () => {
    // --- عناصر الـ DOM ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const loseScreen = document.getElementById('lose-screen');
    const winScreen = document.getElementById('win-screen');

    const startBtn = document.getElementById('start-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const nextButton = document.getElementById('next-btn');

    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const levelNameElement = document.getElementById('level-name');
    const questionCounterElement = document.getElementById('question-counter');
    const progressBarElement = document.getElementById('progress-bar');
    const timerLabel = document.getElementById('timer-label');
    const timerPathRemaining = document.getElementById('timer-path-remaining');

    // --- ثوابت اللعبة ---
    const QUESTIONS_PER_LEVEL = 7;
    const WIN_SCORE_THRESHOLD = 6;
    const TOTAL_LEVELS = 5;
    const TIME_LIMIT = 5;
    const FULL_DASH_ARRAY = 283;
    const levelNames = ["المرحلة الأولى: سهل جداً", "المرحلة الثانية: سهل", "المرحلة الثالثة: اعتيادي", "المرحلة الرابعة: صعب", "المرحلة الخامسة: صعب جداً"];

    // --- متغيرات حالة اللعبة ---
    let availableQuestions = [];
    let currentLevel = 0;
    let levelScore = 0;
    let questionCountInLevel = 0;
    let timerInterval = null;
    let timeLeft = TIME_LIMIT;

    // --- ربط الأحداث ---
    startBtn.addEventListener('click', startGame);
    tryAgainBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', startGame);
    nextButton.addEventListener('click', handleNextButtonClick);

    // --- دوال التحكم في الشاشات ---
    function showScreen(screenToShow) {
        [startScreen, quizScreen, loseScreen, winScreen].forEach(screen => {
            screen.classList.add('hide');
        });
        screenToShow.classList.remove('hide');
    }

    // --- منطق اللعبة الرئيسي ---
    function startGame() {
        currentLevel = 0;
        availableQuestions = [...questions].sort(() => Math.random() - 0.5);
        startLevel();
    }

    function startLevel() {
        levelScore = 0;
        questionCountInLevel = 0;
        levelNameElement.innerText = levelNames[currentLevel];
        showScreen(quizScreen);
        setNextQuestion();
    }

    function handleNextButtonClick() {
        questionCountInLevel++;
        if (questionCountInLevel < QUESTIONS_PER_LEVEL) {
            setNextQuestion();
        } else {
            endLevel();
        }
    }
    
    function endLevel() {
        if (levelScore >= WIN_SCORE_THRESHOLD) {
            currentLevel++;
            if (currentLevel < TOTAL_LEVELS) {
                startLevel();
            } else {
                showScreen(winScreen);
            }
        } else {
            showScreen(loseScreen);
        }
    }

    function setNextQuestion() {
        resetState();
        if (availableQuestions.length === 0) {
            // In case we run out of questions, which shouldn't happen with 100q
            showScreen(winScreen); 
            return;
        }
        const currentQuestion = availableQuestions.pop();
        
        updateProgress();
        questionElement.innerText = currentQuestion.question;
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = true;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });

        startTimer();
    }

    function selectAnswer(e) {
        clearInterval(timerInterval);
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === "true";

        if (isCorrect) {
            levelScore++;
        }

        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === "true");
            button.disabled = true;
        });

        nextButton.classList.remove('hide');
    }

    // --- دوال المؤقت ---
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerLabel.textContent = timeLeft;
            setCircleDasharray();
            setRemainingPathColor(timeLeft);
            if (timeLeft <= 0) {
                handleTimeUp();
            }
        }, 1000);
    }

    function handleTimeUp() {
        clearInterval(timerInterval);
        questionElement.innerText = "انتهى الوقت!";
        Array.from(answerButtonsElement.children).forEach(button => {
            button.disabled = true;
            if (button.dataset.correct) {
                button.classList.add('correct', 'time-out-correct');
            } else {
                button.classList.add('incorrect');
            }
        });
        nextButton.classList.remove('hide');
    }

    // --- دوال مساعدة ---
    function resetState() {
        clearInterval(timerInterval);
        timeLeft = TIME_LIMIT;
        timerLabel.textContent = timeLeft;
        timerPathRemaining.classList.remove("warning");
        timerPathRemaining.setAttribute("stroke-dasharray", `${FULL_DASH_ARRAY}`);
        
        nextButton.classList.add('hide');
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function updateProgress() {
        const progressPercentage = ((questionCountInLevel + 1) / QUESTIONS_PER_LEVEL) * 100;
        progressBarElement.style.width = `${progressPercentage}%`;
        questionCounterElement.innerText = `السؤال ${questionCountInLevel + 1} / ${QUESTIONS_PER_LEVEL}`;
    }

    function setCircleDasharray() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        const timeFraction = rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
        const circleDasharray = `${(timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
        timerPathRemaining.setAttribute("stroke-dasharray", circleDasharray);
    }

    function setRemainingPathColor(time) {
        timerPathRemaining.classList.toggle("warning", time <= 2);
    }

    function setStatusClass(element, correct) {
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
        }
    }

    // --- بنك الأسئلة الكامل (100 سؤال) ---
    const questions = [
        {
            question: 'من هو الهداف التاريخي لبطولة كأس العالم؟',
            answers: [
                { text: 'رونالدو الظاهرة', correct: false },
                { text: 'ميروسلاف كلوزه', correct: true },
                { text: 'جيرد مولر', correct: false },
                { text: 'ليونيل ميسي', correct: false }
            ]
        },
        {
            question: 'أي منتخب فاز بأول نسخة من كأس العالم عام 1930؟',
            answers: [
                { text: 'البرازيل', correct: false },
                { text: 'الأرجنتين', correct: false },
                { text: 'الأوروغواي', correct: true },
                { text: 'إيطاليا', correct: false }
            ]
        },
        {
            question: 'من هو النادي الأكثر تتويجاً بلقب دوري أبطال أوروبا؟',
            answers: [
                { text: 'برشلونة', correct: false },
                { text: 'بايرن ميونخ', correct: false },
                { text: 'ليفربول', correct: false },
                { text: 'ريال مدريد', correct: true }
            ]
        },
        {
            question: 'من هو اللاعب الوحيد الذي فاز بكأس العالم ثلاث مرات؟',
            answers: [
                { text: 'بيليه', correct: true },
                { text: 'مارادونا', correct: false },
                { text: 'زيدان', correct: false },
                { text: 'كافو', correct: false }
            ]
        },
        {
            question: 'في أي عام فازت إسبانيا بأول لقب لها في كأس العالم؟',
            answers: [
                { text: '2006', correct: false },
                { text: '2010', correct: true },
                { text: '2014', correct: false },
                { text: '2002', correct: false }
            ]
        },
        {
            question: 'من هو الهداف التاريخي للدوري الإنجليزي الممتاز؟',
            answers: [
                { text: 'واين روني', correct: false },
                { text: 'آلان شيرر', correct: true },
                { text: 'تييري هنري', correct: false },
                { text: 'هاري كين', correct: false }
            ]
        },
        {
            question: 'كم عدد اللاعبين في فريق كرة القدم على أرض الملعب؟',
            answers: [
                { text: '10', correct: false },
                { text: '11', correct: true },
                { text: '12', correct: false },
                { text: '9', correct: false }
            ]
        },
        {
            question: 'ما هو لقب منتخب إيطاليا لكرة القدم؟',
            answers: [
                { text: 'الديوك', correct: false },
                { text: 'المانشافت', correct: false },
                { text: 'الآزوري', correct: true },
                { text: 'السامبا', correct: false }
            ]
        },
        {
            question: 'من فاز بجائزة الكرة الذهبية لأول مرة عام 1956؟',
            answers: [
                { text: 'ألفريدو دي ستيفانو', correct: false },
                { text: 'ستانلي ماثيوز', correct: true },
                { text: 'ليف ياشين', correct: false },
                { text: 'ريموند كوبا', correct: false }
            ]
        },
        {
            question: 'أي نادي يلعب في ملعب "أولد ترافورد"؟',
            answers: [
                { text: 'ليفربول', correct: false },
                { text: 'أرسنال', correct: false },
                { text: 'مانشستر سيتي', correct: false },
                { text: 'مانشستر يونايتد', correct: true }
            ]
        },
        {
            question: 'من هو المدرب الذي قاد ليستر سيتي للفوز بالدوري الإنجليزي عام 2016؟',
            answers: [
                { text: 'كلاوديو رانييري', correct: true },
                { text: 'جوزيه مورينيو', correct: false },
                { text: 'أرسين فينجر', correct: false },
                { text: 'يورغن كلوب', correct: false }
            ]
        },
        {
            question: 'أي لاعب يُعرف بلقب "البرغوث"؟',
            answers: [
                { text: 'كريستيانو رونالدو', correct: false },
                { text: 'نيمار جونيور', correct: false },
                { text: 'ليونيل ميسي', correct: true },
                { text: 'أندريس إنييستا', correct: false }
            ]
        },
        {
            question: 'ما هو النادي الذي فاز بأول نسخة من الدوري الإنجليزي الممتاز (البريميرليغ)؟',
            answers: [
                { text: 'أرسنال', correct: false },
                { text: 'بلاكبيرن روفرز', correct: false },
                { text: 'مانشستر يونايتد', correct: true },
                { text: 'ليفربول', correct: false }
            ]
        },
        {
            question: 'من هو الهداف التاريخي لمنتخب فرنسا؟',
            answers: [
                { text: 'تييري هنري', correct: false },
                { text: 'ميشيل بلاتيني', correct: false },
                { text: 'أوليفييه جيرو', correct: true },
                { text: 'زين الدين زيدان', correct: false }
            ]
        },
        {
            question: 'كم مرة فاز منتخب ألمانيا بكأس العالم؟',
            answers: [
                { text: '3 مرات', correct: false },
                { text: '4 مرات', correct: true },
                { text: '5 مرات', correct: false },
                { text: 'مرتين', correct: false }
            ]
        },
        {
            question: 'ما هو اسم الملعب الرئيسي لنادي برشلونة؟',
            answers: [
                { text: 'سانتياغو برنابيو', correct: false },
                { text: 'كامب نو', correct: true },
                { text: 'واندا ميتروبوليتانو', correct: false },
                { text: 'ميستايا', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي سجل أسرع هاتريك في تاريخ الدوري الإنجليزي الممتاز؟',
            answers: [
                { text: 'روبي فاولر', correct: false },
                { text: 'ساديو ماني', correct: true },
                { text: 'سيرجيو أجويرو', correct: false },
                { text: 'محمد صلاح', correct: false }
            ]
        },
        {
            question: 'في أي بلد أقيمت بطولة كأس العالم 2002؟',
            answers: [
                { text: 'ألمانيا', correct: false },
                { text: 'فرنسا', correct: false },
                { text: 'كوريا الجنوبية واليابان', correct: true },
                { text: 'جنوب أفريقيا', correct: false }
            ]
        },
        {
            question: 'من هو النادي الذي حقق الثلاثية التاريخية (الدوري والكأس ودوري الأبطال) مرتين؟',
            answers: [
                { text: 'ريال مدريد', correct: false },
                { text: 'بايرن ميونخ', correct: false },
                { text: 'برشلونة', correct: true },
                { text: 'مانشستر يونايتد', correct: false }
            ]
        },
        {
            question: 'من هو حارس المرمى الوحيد الذي فاز بجائزة الكرة الذهبية؟',
            answers: [
                { text: 'مانويل نوير', correct: false },
                { text: 'جانلويجي بوفون', correct: false },
                { text: 'ليف ياشين', correct: true },
                { text: 'دينو زوف', correct: false }
            ]
        },
        {
            question: 'من هو الهداف التاريخي لنادي ريال مدريد؟',
            answers: [
                { text: 'ألفريدو دي ستيفانو', correct: false },
                { text: 'راؤول غونزاليس', correct: false },
                { text: 'كريستيانو رونالدو', correct: true },
                { text: 'كريم بنزيما', correct: false }
            ]
        },
        {
            question: 'أي منتخب فاز بكأس أمم أوروبا 2004 في مفاجأة كبيرة؟',
            answers: [
                { text: 'البرتغال', correct: false },
                { text: 'اليونان', correct: true },
                { text: 'إسبانيا', correct: false },
                { text: 'فرنسا', correct: false }
            ]
        },
        {
            question: 'ما هو لقب نادي يوفنتوس الإيطالي؟',
            answers: [
                { text: 'الروسونيري', correct: false },
                { text: 'النيراتزوري', correct: false },
                { text: 'البيانكونيري (السيدة العجوز)', correct: true },
                { text: 'الجيالوروسي', correct: false }
            ]
        },
        {
            question: 'من سجل "هدف يد الرب" الشهير في كأس العالم 1986؟',
            answers: [
                { text: 'دييغو مارادونا', correct: true },
                { text: 'غاري لينيكر', correct: false },
                { text: 'خورخي فالدانو', correct: false },
                { text: 'ميشيل بلاتيني', correct: false }
            ]
        },
        {
            question: 'ما هو النادي الذي فاز بأكبر عدد من ألقاب الدوري الإيطالي (الكالتشيو)؟',
            answers: [
                { text: 'إيه سي ميلان', correct: false },
                { text: 'إنتر ميلان', correct: false },
                { text: 'يوفنتوس', correct: true },
                { text: 'روما', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الأكثر ظهوراً في تاريخ الدوري الإنجليزي الممتاز؟',
            answers: [
                { text: 'ريان غيغز', correct: false },
                { text: 'جاريث باري', correct: true },
                { text: 'فرانك لامبارد', correct: false },
                { text: 'جيمس ميلنر', correct: false }
            ]
        },
        {
            question: 'أي دولة استضافت كأس العالم للسيدات 2019؟',
            answers: [
                { text: 'ألمانيا', correct: false },
                { text: 'كندا', correct: false },
                { text: 'فرنسا', correct: true },
                { text: 'الولايات المتحدة', correct: false }
            ]
        },
        {
            question: 'من هو المدرب الأكثر فوزاً بلقب دوري أبطال أوروبا؟',
            answers: [
                { text: 'بيب غوارديولا', correct: false },
                { text: 'زين الدين زيدان', correct: false },
                { text: 'كارلو أنشيلوتي', correct: true },
                { text: 'السير أليكس فيرغسون', correct: false }
            ]
        },
        {
            question: 'ما هو اسم الكرة الرسمية لكأس العالم 2014 في البرازيل؟',
            answers: [
                { text: 'جابولاني', correct: false },
                { text: 'تيلستار', correct: false },
                { text: 'برازوكا', correct: true },
                { text: 'فيفرنوفا', correct: false }
            ]
        },
        {
            question: 'من هو الهداف التاريخي لبطولة كوبا أمريكا؟',
            answers: [
                { text: 'ليونيل ميسي', correct: false },
                { text: 'نوربيرتو مينديز وزيزينيو', correct: true },
                { text: 'غابرييل باتيستوتا', correct: false },
                { text: 'بيليه', correct: false }
            ]
        },
        {
            question: 'أي نادي إنجليزي يُعرف بلقب "المدفعجية"؟',
            answers: [
                { text: 'تشيلسي', correct: false },
                { text: 'توتنهام هوتسبير', correct: false },
                { text: 'أرسنال', correct: true },
                { text: 'وست هام يونايتد', correct: false }
            ]
        },
        {
            question: 'في أي عام تم تقديم قاعدة "البطاقة الصفراء" و "البطاقة الحمراء" في كأس العالم؟',
            answers: [
                { text: '1966', correct: false },
                { text: '1970', correct: true },
                { text: '1974', correct: false },
                { text: '1982', correct: false }
            ]
        },
        {
            question: 'من هو النادي الألماني الذي فاز بالثلاثية التاريخية عام 2013؟',
            answers: [
                { text: 'بوروسيا دورتموند', correct: false },
                { text: 'بايرن ميونخ', correct: true },
                { text: 'باير ليفركوزن', correct: false },
                { text: 'شالكه 04', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي سجل هدف الفوز لهولندا في نهائي يورو 1988؟',
            answers: [
                { text: 'رود خوليت', correct: false },
                { text: 'فرانك ريكارد', correct: false },
                { text: 'ماركو فان باستن', correct: true },
                { text: 'رونالد كومان', correct: false }
            ]
        },
        {
            question: 'كم مرة فاز ليونيل ميسي بجائزة الكرة الذهبية؟',
            answers: [
                { text: '6 مرات', correct: false },
                { text: '7 مرات', correct: false },
                { text: '8 مرات', correct: true },
                { text: '5 مرات', correct: false }
            ]
        },
        {
            question: 'ما هو الملعب الوطني لإنجلترا؟',
            answers: [
                { text: 'ملعب الإمارات', correct: false },
                { text: 'ملعب ويمبلي', correct: true },
                { text: 'ستانفورد بريدج', correct: false },
                { text: 'أنفيلد', correct: false }
            ]
        },
        {
            question: 'من هو أول لاعب أفريقي يفوز بجائزة الكرة الذهبية؟',
            answers: [
                { text: 'ديدييه دروغبا', correct: false },
                { text: 'جورج ويا', correct: true },
                { text: 'صامويل إيتو', correct: false },
                { text: 'يايا توريه', correct: false }
            ]
        },
        {
            question: 'ما هي الدولة التي فازت بأكبر عدد من ألقاب كوبا أمريكا؟',
            answers: [
                { text: 'البرازيل', correct: false },
                { text: 'الأوروغواي والأرجنتين', correct: true },
                { text: 'تشيلي', correct: false },
                { text: 'باراغواي', correct: false }
            ]
        },
        {
            question: 'من هو المدرب الذي قاد منتخب إيطاليا للفوز بكأس العالم 2006؟',
            answers: [
                { text: 'تشيزاري برانديلي', correct: false },
                { text: 'مارتشيلو ليبي', correct: true },
                { text: 'فابيو كابيلو', correct: false },
                { text: 'أريغو ساكي', correct: false }
            ]
        },
        {
            question: 'أي فريق فاز بدوري أبطال أوروبا عام 2005 في "معجزة إسطنبول"؟',
            answers: [
                { text: 'إيه سي ميلان', correct: false },
                { text: 'يوفنتوس', correct: false },
                { text: 'ليفربول', correct: true },
                { text: 'برشلونة', correct: false }
            ]
        },
        {
            question: 'ما هو اسم الدوري الهولندي الممتاز؟',
            answers: [
                { text: 'البوندسليغا', correct: false },
                { text: 'الدوري الهولندي (Eredivisie)', correct: true },
                { text: 'ليغ 1', correct: false },
                { text: 'الدوري البلجيكي للمحترفين', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي سجل الهدف الذهبي لفرنسا في نهائي يورو 2000؟',
            answers: [
                { text: 'زين الدين زيدان', correct: false },
                { text: 'سيلفان ويلتورد', correct: false },
                { text: 'دافيد تريزيغيه', correct: true },
                { text: 'تييري هنري', correct: false }
            ]
        },
        {
            question: 'في أي مدينة يقع ملعب "سان سيرو"؟',
            answers: [
                { text: 'روما', correct: false },
                { text: 'تورينو', correct: false },
                { text: 'ميلانو', correct: true },
                { text: 'نابولي', correct: false }
            ]
        },
        {
            question: 'ما هو النادي الذي فاز بأول نسخة من كأس العالم للأندية؟',
            answers: [
                { text: 'ريال مدريد', correct: false },
                { text: 'مانشستر يونايتد', correct: false },
                { text: 'كورينثيانز', correct: true },
                { text: 'بوكا جونيورز', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي يحمل الرقم القياسي لعدد الأهداف في موسم واحد بالدوري الإسباني؟',
            answers: [
                { text: 'كريستيانو رونالدو', correct: false },
                { text: 'لويس سواريز', correct: false },
                { text: 'ليونيل ميسي', correct: true },
                { text: 'هوغو سانشيز', correct: false }
            ]
        },
        {
            question: 'أي منتخب يُلقب بـ "الشياطين الحمر"؟',
            answers: [
                { text: 'إسبانيا', correct: false },
                { text: 'بلجيكا', correct: true },
                { text: 'إنجلترا', correct: false },
                { text: 'مصر', correct: false }
            ]
        },
        {
            question: 'من سجل هدف الفوز لألمانيا في نهائي كأس العالم 2014؟',
            answers: [
                { text: 'توماس مولر', correct: false },
                { text: 'ماريو غوتزه', correct: true },
                { text: 'مسعود أوزيل', correct: false },
                { text: 'أندريه شورله', correct: false }
            ]
        },
        {
            question: 'في أي نادي يلعب كيليان مبابي حالياً؟',
            answers: [
                { text: 'ريال مدريد', correct: true },
                { text: 'باريس سان جيرمان', correct: false },
                { text: 'موناكو', correct: false },
                { text: 'ليفربول', correct: false }
            ]
        },
        {
            question: 'من هو المدرب التاريخي لنادي مانشستر يونايتد؟',
            answers: [
                { text: 'مات بازبي', correct: false },
                { text: 'السير أليكس فيرغسون', correct: true },
                { text: 'لويس فان غال', correct: false },
                { text: 'جوزيه مورينيو', correct: false }
            ]
        },
        {
            question: 'ما هو أقدم نادي كرة قدم محترف في العالم؟',
            answers: [
                { text: 'شيفيلد وينزداي', correct: false },
                { text: 'نوتس كاونتي', correct: true },
                { text: 'أستون فيلا', correct: false },
                { text: 'مانشستر يونايتد', correct: false }
            ]
        },
        {
            question: 'من هو الهداف التاريخي لكأس الأمم الأفريقية؟',
            answers: [
                { text: 'ديدييه دروغبا', correct: false },
                { text: 'صامويل إيتو', correct: true },
                { text: 'لوران بوكو', correct: false },
                { text: 'رشيدي يكيني', correct: false }
            ]
        },
        {
            question: 'أي نادي فاز بأول لقب في تاريخ دوري أبطال أوروبا (كأس أوروبا للأندية البطلة)؟',
            answers: [
                { text: 'برشلونة', correct: false },
                { text: 'إيه سي ميلان', correct: false },
                { text: 'ريال مدريد', correct: true },
                { text: 'بنفيكا', correct: false }
            ]
        },
        {
            question: 'كم مرة فاز منتخب البرازيل بكأس العالم؟',
            answers: [
                { text: '4 مرات', correct: false },
                { text: '5 مرات', correct: true },
                { text: '6 مرات', correct: false },
                { text: '3 مرات', correct: false }
            ]
        },
        {
            question: 'ما هو اسم ديربي مدينة ميلانو؟',
            answers: [
                { text: 'ديربي ديلا كابيتالي', correct: false },
                { text: 'ديربي ديلا مادونينا', correct: true },
                { text: 'ديربي إيطاليا', correct: false },
                { text: 'ديربي تورينو', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب صاحب الرقم القياسي في عدد المباريات مع منتخب إسبانيا؟',
            answers: [
                { text: 'إيكر كاسياس', correct: false },
                { text: 'سيرجيو راموس', correct: true },
                { text: 'أندريس إنييستا', correct: false },
                { text: 'تشافي هيرنانديز', correct: false }
            ]
        },
        {
            question: 'ما هي القاعدة التي تمنع حارس المرمى من إمساك الكرة بيديه إذا مررها له زميله بقدمه عمدًا؟',
            answers: [
                { text: 'قاعدة التسلل', correct: false },
                { text: 'قاعدة التمرير الخلفي', correct: true },
                { text: 'قاعدة الـ 6 ثواني', correct: false },
                { text: 'قاعدة اللعب النظيف', correct: false }
            ]
        },
        {
            question: 'من هو النادي الذي فاز بدوري أبطال آسيا أكبر عدد من المرات؟',
            answers: [
                { text: 'الاتحاد السعودي', correct: false },
                { text: 'بوهانغ ستيلرز الكوري', correct: false },
                { text: 'الهلال السعودي', correct: true },
                { text: 'أوراوا ريد دايموندز الياباني', correct: false }
            ]
        },
        {
            question: 'ما هو لقب منتخب هولندا؟',
            answers: [
                { text: 'الأسود الثلاثة', correct: false },
                { text: 'الطواحين', correct: true },
                { text: 'النسور', correct: false },
                { text: 'الفيلة', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي سجل هدف الفوز لإسبانيا في نهائي يورو 2008؟',
            answers: [
                { text: 'دافيد فيا', correct: false },
                { text: 'فرناندو توريس', correct: true },
                { text: 'تشافي هيرنانديز', correct: false },
                { text: 'سيسك فابريغاس', correct: false }
            ]
        },
        {
            question: 'أي لاعب فاز بجائزة الحذاء الذهبي الأوروبي أكبر عدد من المرات؟',
            answers: [
                { text: 'كريستيانو رونالدو', correct: false },
                { text: 'لويس سواريز', correct: false },
                { text: 'ليونيل ميسي', correct: true },
                { text: 'تييري هنري', correct: false }
            ]
        },
        {
            question: 'في أي عام تأسس الاتحاد الدولي لكرة القدم (فيفا)؟',
            answers: [
                { text: '1899', correct: false },
                { text: '1904', correct: true },
                { text: '1912', correct: false },
                { text: '1920', correct: false }
            ]
        },
        {
            question: 'من هو هداف نادي برشلونة التاريخي؟',
            answers: [
                { text: 'لويس سواريز', correct: false },
                { text: 'سيزار رودريغيز', correct: false },
                { text: 'ليونيل ميسي', correct: true },
                { text: 'ريفالدو', correct: false }
            ]
        },
        {
            question: 'ما هو اسم الكأس التي تُمنح للفائز بالدوري الإنجليزي الممتاز؟',
            answers: [
                { text: 'كأس الاتحاد الإنجليزي', correct: false },
                { text: 'درع الدوري الإنجليزي', correct: true },
                { text: 'كأس الرابطة', correct: false },
                { text: 'الدرع الخيرية', correct: false }
            ]
        },
        {
            question: 'أي دولة فازت بأول بطولة لكأس أمم أوروبا عام 1960؟',
            answers: [
                { text: 'إسبانيا', correct: false },
                { text: 'الاتحاد السوفيتي', correct: true },
                { text: 'يوغوسلافيا', correct: false },
                { text: 'فرنسا', correct: false }
            ]
        },
        {
            question: 'ما هو النادي الذي فاز بالدوري الفرنسي "ليغ 1" أكبر عدد من المرات؟',
            answers: [
                { text: 'أولمبيك مارسيليا', correct: false },
                { text: 'باريس سان جيرمان', correct: true },
                { text: 'سانت إتيان', correct: false },
                { text: 'أولمبيك ليون', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي سجل أكثر عدد من الأهداف في سنة ميلادية واحدة؟',
            answers: [
                { text: 'جيرد مولر', correct: false },
                { text: 'بيليه', correct: false },
                { text: 'ليونيل ميسي', correct: true },
                { text: 'كريستيانو رونالدو', correct: false }
            ]
        },
        {
            question: 'ما هو اسم المباراة التي تجمع بين ريال مدريد وبرشلونة؟',
            answers: [
                { text: 'الديربي', correct: false },
                { text: 'الكلاسيكو', correct: true },
                { text: 'السوبر كلاسيكو', correct: false },
                { text: 'المباراة الكبرى', correct: false }
            ]
        },
        {
            question: 'أي لاعب إنجليزي هو الوحيد الذي فاز بالكرة الذهبية أثناء لعبه في الدوري الإنجليزي؟',
            answers: [
                { text: 'واين روني', correct: false },
                { text: 'مايكل أوين', correct: true },
                { text: 'ديفيد بيكهام', correct: false },
                { text: 'آلان شيرر', correct: false }
            ]
        },
        {
            question: 'ما هو النادي الذي يُعرف باسم "الحمر" (The Reds)؟',
            answers: [
                { text: 'مانشستر يونايتد', correct: false },
                { text: 'ليفربول', correct: true },
                { text: 'أرسنال', correct: false },
                { text: 'أستون فيلا', correct: false }
            ]
        },
        {
            question: 'من هو الهداف التاريخي لمنتخب البرازيل؟',
            answers: [
                { text: 'رونالدو', correct: false },
                { text: 'نيمار', correct: true },
                { text: 'بيليه', correct: false },
                { text: 'روماريو', correct: false }
            ]
        },
        {
            question: 'أي نادي فاز بدوري أبطال أوروبا عام 1999 في نهاية دراماتيكية ضد بايرن ميونخ؟',
            answers: [
                { text: 'يوفنتوس', correct: false },
                { text: 'مانشستر يونايتد', correct: true },
                { text: 'ريال مدريد', correct: false },
                { text: 'برشلونة', correct: false }
            ]
        },
        {
            question: 'ما هو عدد التبديلات المسموح بها للفريق الواحد في المباراة الرسمية حالياً؟',
            answers: [
                { text: '3 تبديلات', correct: false },
                { text: '4 تبديلات', correct: false },
                { text: '5 تبديلات', correct: true },
                { text: '6 تبديلات', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي يحمل الرقم القياسي لأكبر عدد من التمريرات الحاسمة في تاريخ الدوري الإنجليزي؟',
            answers: [
                { text: 'سيسك فابريغاس', correct: false },
                { text: 'ريان غيغز', correct: true },
                { text: 'واين روني', correct: false },
                { text: 'كيفين دي بروين', correct: false }
            ]
        },
        {
            question: 'ما هو لقب منتخب الأرجنتين؟',
            answers: [
                { text: 'السيليستي', correct: false },
                { text: 'التانغو (الألبيسيليستي)', correct: true },
                { text: 'لا روخا', correct: false },
                { text: 'لوس كافيتيروس', correct: false }
            ]
        },
        {
            question: 'أي مدينة استضافت أولمبياد 1992 التي شهدت ظهور "فريق الأحلام" لبرشلونة بقيادة كرويف؟',
            answers: [
                { text: 'أتلانتا', correct: false },
                { text: 'برشلونة', correct: true },
                { text: 'سيدني', correct: false },
                { text: 'لوس أنجلوس', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الهولندي الذي اشتهر بـ "الدوران" الخاص به (Cruyff Turn)؟',
            answers: [
                { text: 'ماركو فان باستن', correct: false },
                { text: 'يوهان كرويف', correct: true },
                { text: 'آريين روبن', correct: false },
                { text: 'دينيس بيركامب', correct: false }
            ]
        },
        {
            question: 'من هو النادي الأكثر فوزًا بكأس الاتحاد الإنجليزي؟',
            answers: [
                { text: 'مانشستر يونايتد', correct: false },
                { text: 'أرسنال', correct: true },
                { text: 'تشيلسي', correct: false },
                { text: 'ليفربول', correct: false }
            ]
        },
        {
            question: 'ما هو النادي الذي فاز بالدوري الألماني (البوندسليغا) لأول مرة في تاريخه موسم 2023-2024؟',
            answers: [
                { text: 'بوروسيا دورتموند', correct: false },
                { text: 'باير ليفركوزن', correct: true },
                { text: 'شتوتغارت', correct: false },
                { text: 'آر بي لايبزيغ', correct: false }
            ]
        },
        {
            question: 'من هو الهداف التاريخي لمنتخب البرتغال؟',
            answers: [
                { text: 'أوزيبيو', correct: false },
                { text: 'لويس فيغو', correct: false },
                { text: 'كريستيانو رونالدو', correct: true },
                { text: 'باوليتا', correct: false }
            ]
        },
        {
            question: 'كم يستغرق الشوط الواحد في مباراة كرة القدم الرسمية (بدون وقت إضافي)؟',
            answers: [
                { text: '40 دقيقة', correct: false },
                { text: '45 دقيقة', correct: true },
                { text: '50 دقيقة', correct: false },
                { text: '30 دقيقة', correct: false }
            ]
        },
        {
            question: 'ما هو اسم المباراة التي تجمع بين بوكا جونيورز وريفر بليت في الأرجنتين؟',
            answers: [
                { text: 'الكلاسيكو', correct: false },
                { text: 'ديربي ديلا كابيتالي', correct: false },
                { text: 'السوبر كلاسيكو', correct: true },
                { text: 'أولد فيرم', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي فاز بجائزة أفضل لاعب في كأس العالم 2014؟',
            answers: [
                { text: 'توماس مولر', correct: false },
                { text: 'أريين روبن', correct: false },
                { text: 'ليونيل ميسي', correct: true },
                { text: 'جيمس رودريغيز', correct: false }
            ]
        },
        {
            question: 'ما هو أقصى عدد من اللاعبين الأجانب المسموح بهم على أرض الملعب في الدوري السعودي للمحترفين (حسب لوائح 2023-2024)؟',
            answers: [
                { text: '7 لاعبين', correct: false },
                { text: '8 لاعبين', correct: true },
                { text: '9 لاعبين', correct: false },
                { text: '6 لاعبين', correct: false }
            ]
        },
        {
            question: 'من هو المدرب الذي قاد نادي بورتو للفوز بدوري أبطال أوروبا عام 2004؟',
            answers: [
                { text: 'فرناندو سانتوس', correct: false },
                { text: 'جوزيه مورينيو', correct: true },
                { text: 'أندريه فيلاش-بواش', correct: false },
                { text: 'كارلوس كيروش', correct: false }
            ]
        },
        {
            question: 'أي لاعب سجل "هدف العقرب" الشهير لأرسنال ضد كريستال بالاس؟',
            answers: [
                { text: 'أليكسيس سانشيز', correct: false },
                { text: 'مسعود أوزيل', correct: false },
                { text: 'أوليفييه جيرو', correct: true },
                { text: 'سانتي كازورلا', correct: false }
            ]
        },
        {
            question: 'ما هو النادي الذي يُلقب بـ "البلوز" (The Blues)؟',
            answers: [
                { text: 'مانشستر سيتي', correct: false },
                { text: 'إيفرتون', correct: false },
                { text: 'تشيلسي', correct: true },
                { text: 'ليستر سيتي', correct: false }
            ]
        },
        {
            question: 'في أي بلد سيقام كأس العالم 2026؟',
            answers: [
                { text: 'قطر', correct: false },
                { text: 'البرازيل', correct: false },
                { text: 'الولايات المتحدة، كندا، والمكسيك', correct: true },
                { text: 'المغرب، إسبانيا، والبرتغال', correct: false }
            ]
        },
        {
            question: 'من هو اللاعب الذي سجل أسرع هدف في تاريخ كأس العالم؟',
            answers: [
                { text: 'كلينت ديمبسي', correct: false },
                { text: 'هاكان شوكور', correct: true },
                { text: 'براين روبسون', correct: false },
                { text: 'رونالدو', correct: false }
            ]
        }
    ];

});
