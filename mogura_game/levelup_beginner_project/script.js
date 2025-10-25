// Copyright (c) 2025 Garyumaru / Garyu Games
// 本コンテンツの著作権は制作者に帰属します。
// 詳細はプロジェクトルートの _TERMS_OF_USE.md をご確認ください。

// HTMLから要素を取得
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');

let score = 0;
let timeLeft = 30;
let moleTimerId = null; // モグラのタイマー
let gameTimerId = null; // ゲーム全体のタイマー
let moleInterval = 800; // モグラの出現間隔（初期値: 800ms）
let difficultyTimerId = null; // 難易度を上げるタイマー

/**
 * すべての穴からモグラクラスを削除する関数
 */
function clearMoles() {
    holes.forEach(hole => hole.classList.remove('mole'));
}

/**
 * ランダムな穴にモグラを表示する関数
 */
function showMole() {
    clearMoles();
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];
    randomHole.classList.add('mole');
}

/**
 * モグラを叩いた（クリックした）時の処理
 * @param {Event} event 
 */
function whack(event) {
    // ゲーム中(gameTimerIdが動いている間)だけ叩けるようにする
    if (event.target.classList.contains('mole') && gameTimerId) { 
        score++;
        scoreDisplay.textContent = score;
        event.target.classList.remove('mole');
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
        alert('ゲーム終了！あなたのスコアは ' + score + ' でした！');
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

// --- イベントの設定 ---
holes.forEach(hole => hole.addEventListener('click', whack));
startButton.addEventListener('click', startGame);
