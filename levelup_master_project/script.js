// Copyright (c) 2025 Garyumaru / Garyu Games
// 本コンテンツの著作権は制作者に帰属します。
// 詳細はプロジェクトルートの _TERMS_OF_USE.md をご確認ください。

// HTMLから要素を取得
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container'); // エフェクト表示用
const highScoreDisplay = document.getElementById('high-score');

let score = 0;
let timeLeft = 30;
let moleTimerId = null; // モグラのタイマー
let gameTimerId = null; // ゲーム全体のタイマー
let moleInterval = 800; // モグラの出現間隔（初期値: 800ms）
let difficultyTimerId = null; // 難易度を上げるタイマー
let highScore = 0;

/**
 * すべての穴からモグラクラスを削除する関数
 */
function clearMoles() {
    holes.forEach(hole => hole.classList.remove('mole', 'bomb'));
}

/**
 * ランダムな穴にモグラを表示する関数
 */
function showMole() {
    clearMoles();
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];

    // 30%の確率で偽モグラ(bomb)を出す
    if (Math.random() < 0.3) {
        randomHole.classList.add('bomb');
    } else {
        randomHole.classList.add('mole');
    }
}

/**
 * スコア加算エフェクトを表示する関数
 * @param {HTMLElement} hole - 叩かれた穴の要素
 */
function showScoreEffect(hole) {
    const scoreEffect = document.createElement('div');
    scoreEffect.textContent = '+1';
    scoreEffect.classList.add('score-effect');

    // 穴のオフセット位置を取得
    const holeRect = hole.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    // game-container内での相対位置を計算
    scoreEffect.style.left = `${holeRect.left - containerRect.left + (holeRect.width / 2) - 15}px`;
    scoreEffect.style.top = `${holeRect.top - containerRect.top}px`;

    gameContainer.appendChild(scoreEffect);

    // アニメーションが終わったら要素を削除
    scoreEffect.addEventListener('animationend', () => {
        scoreEffect.remove();
    });
}

/**
 * モグラを叩いた（クリックした）時の処理
 * @param {Event} event 
 */
function whack(event) {
    if (!gameTimerId) return; // ゲームが動いていなければ何もしない

    const hole = event.target;

    // モグラを叩いた場合
    if (hole.classList.contains('mole')) {
        score++;
        scoreDisplay.textContent = score;
        hole.classList.remove('mole');
        showScoreEffect(hole); // エフェクト表示関数を呼び出す！
    } 
    // 偽モグラを叩いた場合
    else if (hole.classList.contains('bomb')) {
        score--;
        scoreDisplay.textContent = score;
        hole.classList.remove('bomb');
    }
}

/**
 * ゲームのカウントダウン処理
 */
function countDown() {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
        // ゲーム終了
        clearInterval(gameTimerId); // ゲームタイマー停止
        clearInterval(moleTimerId); // モグラ停止
        clearInterval(difficultyTimerId); // 難易度タイマーも停止
        
        // ハイスコアのチェックと更新
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = highScore;
            alert('ハイスコア更新！ ' + highScore + '点！');
        } else {
            alert('ゲーム終了！あなたのスコアは ' + score + ' でした！');
        }

        clearMoles();
        gameTimerId = null; // ゲームが動いていない状態にする
    }
}

/**
 * ゲーム開始処理
 */
function startGame() {
    // 既にゲームが動いていたら何もしない
    if (gameTimerId) return; 

    // 変数をリセット
    score = 0;
    timeLeft = 30;
    moleInterval = 800; // スピードをリセット
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;

    // モグラ出現タイマーを開始
    moleTimerId = setInterval(showMole, moleInterval);
    
    // ゲーム全体のタイマーを開始
    gameTimerId = setInterval(countDown, 1000);

    // 難易度を徐々に上げるタイマーを開始 (5秒ごとに速くする)
    difficultyTimerId = setInterval(() => {
        // 300msより速くならないように制限
        if (moleInterval > 300) {
            moleInterval -= 50; // 50msずつ速くする

            // モグラ出現タイマーを新しい間隔で再設定
            clearInterval(moleTimerId);
            moleTimerId = setInterval(showMole, moleInterval);
        }
    }, 5000);
}

// --- ハイスコアの読み込み ---
function loadHighScore() {
    // localStorageからハイスコアを取得。なければ0をセット
    highScore = localStorage.getItem('highScore') || 0;
    highScoreDisplay.textContent = highScore;
}

loadHighScore(); // ページ読み込み時にハイスコアをロード

// --- イベントの設定 ---
holes.forEach(hole => hole.addEventListener('click', whack));
startButton.addEventListener('click', startGame);
