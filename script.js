'use strict'
// 1行目に記載している 'use strict' は削除しないでください
/****************************************
 グローバル変数
****************************************/
//・山札 = [] 13で1マーク分
let deck = [];

// ・自分のカード
let myCards = [];
// ・相手のカード
let enemyCards = [];
// ・勝敗の決定
let winOrLose = false;//boolean

/**************************************
 ユーザー操作に連動する関数
 **************************************/
// ・　読み込み終了後
window.addEventListener("load", baseload);

// ・「カードを引く」を選択したとき
document.querySelector("#pick").addEventListener("click", pushPickUpCard);

// ・「勝負する！」を押したとき
document.querySelector("#battle").addEventListener("click", battle);

// ・「もう一度遊ぶ」を選択したとき
document.querySelector("#reset").addEventListener("click", reload);




/****************************************
 処理を行う関数
 ****************************************/
function baseload() {
  //山札をシャッフルする
  shuffle();
  //一枚目を引く
  pickMyCard();
  pickEnemyCard();
  //画面を更新
  replace(0);
  //デバッグ情報（グローバル変数の現在値）
  debug();
}

function shuffle() {
  //カード初期化
  for (let i = 0; i <= 51; i++) {
    deck.push(i);
  }
  //山札配列の順番を100回入れ替える
  for (let i = 0; i < 100; i++) {
    //山札からカードを2枚引き、カードを変数に格納
    let card1 = Math.floor(Math.random() * 52);
    let card2 = Math.floor(Math.random() * 52);
    //交換（数字一時格納配列）
    let card3 = deck[card1];
    deck[card1] = deck[card2];
    deck[card2] = card3;
  }
}

//自分のカードを引く関数
function pickMyCard() {
  if (myCards.length < 6) {
    //山札配列から1枚とりだす
    let pickedCard = deck.pop();
    //取り出したカードを自分配列に格納
    myCards.push(pickedCard);
  }

}

//aite ka-do hiku
function pickEnemyCard() {
  //考える関数がfalseになるか、場の数いっぱいになるまで繰り返し引く
  while (pickAi() === true && enemyCards.length < 6) {
    //山札配列から一枚取り出す
    let pickedCard = deck.pop()
    //取り出したカードを相手配列に格納
    enemyCards.push(pickedCard)
  }
}

//相手の考える思考
function pickAi() {
  //手札の合計を取得
  let total = getTotal(enemyCards)
  //引くか引かないか
  let pickOrStay = false;
  //引く思考（18以上なら引かない）
  if (total <= 17) {
    pickOrStay = true;
  } else {
    pickOrStay = false
  }
  return pickOrStay;
}
//gamen kousin

//手札の合計値計算
function getTotal(Cards) {
  let total = 0;
  let num = 0;
  //total変数に配列要素の値を足していく
  for (let i = 0; i < Cards.length; i++) {

    //A~Kに直す為、13で割った余りを変数に入れる
    num = Cards[i] % 13

    //J~Kは余りが11,12,0　絵柄は　10を足す必要がある
    if (num === 11 || num === 12 || num === 0) {
      total += 10
    } else {
      total += num
    }
    //Aは21を超えないなら10足す　超えるなら1足す
    //Aは配列要素では1,14,27,40
    if (Cards.includes(1) || Cards.includes(14) ||
      Cards.includes(27) || Cards.includes(40)) {
      //10足しても21超えないならAは11とする（1はすでに足されているので10足す）
      if (total + 10 <= 21) {
        total += 10
      }
    }
  }
  return total;
}

//画面を更新する関数
function replace(bool) {
  //配列に表示枠を格納
  let myField = document.querySelectorAll(".myItems")
  console.log(myField)
  //表示枠の中を見ていく
  for (let i = 0; i < myField.length; i++) {
    //自分の手元にカードがあるか？  
    if (myCards.length > i) {
      console.log("+++++")
      //数字に対応した画像に置き換える
      myField[i].setAttribute("src", "../image/" + myCards[i] + ".png");
    } else {
      myField[i].setAttribute("src", "../image/card_back.png");
    }
  }

  //相手のカード表示
  let enemyField = document.querySelectorAll(".enemyItem")
  for (let i = 0; i < enemyField.length; i++) {
    //相手の手元にカードがあるか？  
    if (i < 1 || (enemyCards.length > i && bool > 0)) {
      //数字に対応した画像に置き換える
      enemyField[i].setAttribute("src", "../image/" + enemyCards[i] + ".png");
    } else {
      console.log(";;;;;;;")
      enemyField[i].setAttribute("src", "../image/card_back.png");
    }
  }
  //カードの合計値計算
  document.querySelector("#myTotal").innerText = getTotal(myCards)
  if (bool > 0) {
    document.querySelector("#enemyTotal").innerText = getTotal(enemyCards)
  }

  if (getTotal(myCards) >= 22) {
    alert("あなたの負けです")
    for (let i = 0; i < enemyField.length; i++) {
      if (enemyCards.length > i) {
        enemyField[i].setAttribute("src", "../image/" + enemyCards[i] + ".png");
      } else {
        enemyField[i].setAttribute("src", "../image/card_back.png");
      }
    }
    document.querySelector("#enemyTotal").innerText = getTotal(enemyCards);
  }
}



//カードを引くボタンが押した時に実行する関数
function pushPickUpCard() {
  //勝敗が決まっていないか？
  if (winOrLose === false) {
    //自分のカードを引く関数
    pickMyCard();
    //相手がカードを引く関数
    pickEnemyCard();
    //画面を更新
    replace(0)
  }
}

//勝負するボタンを押した時に実行する関数
function battle() {
  replace(1)

  //勝敗結果を格納する変数宣言
  let battleResult;

  //勝敗が決まっているか？
  if (winOrLose === false) {
    //勝敗結果を変数に格納
    battleResult = judge();

    //勝負の結果を出力する関数に引数として渡す
    showBattleResult(battleResult);

    //勝敗フラグを立てる
    winOrLose = true
  }
}



function reload() {
  //リロードメソッドで再読込
  location.reload()
}

//勝敗を判定する関数
function judge() {
  //結果を格納する変数を宣言
  let judgeResult;

  //jibun ka-do goukei
  let mTotal = getTotal(myCards)
  //aite ka-do goukei
  let eneTotal = getTotal(enemyCards)
  //勝敗のパターンで勝敗を決める　
  //自分22以上VS相手21以下　相手の勝ち
  if (mTotal >= 22 && eneTotal <= 21) {
    judgeResult = "Lose"

    // 自分21以下VS相手22以上　自分の勝ち
  } else if (mTotal <= 21 && eneTotal >= 22) {
    judgeResult = "Win"

    // 両方22以上　引き分け
  } else if (mTotal >= 22 && eneTotal >= 22) {
    judgeResult = "Lose"

    // 両方21以下　数が多い方が勝ち　同数は引き分け
  } else {
    if (mTotal > eneTotal) {
      judgeResult = "Win"
    } else if (mTotal < eneTotal) {
      judgeResult = "Lose"
    } else {
      judgeResult = "Lose"
    }
  }
  return judgeResult;
}

//勝負の結果を表示する関数
function showBattleResult(battleResult) {
  let outputMassage = ""
  //入っている文字列で結果を分岐
  if (battleResult === "Win") {
    outputMassage = "あなた勝ちです！"
  } else if (battleResult === "Lose") {
    outputMassage = "あなたの負けです。"
  } else {
    outputMassage = "引き分けです。"
  }
  alert(outputMassage)
}

function debug() {
  console.log("カードの山", deck)
  console.log("自分のカード", myCards, "合計" + getTotal(myCards))
  console.log("相手のカード", enemyCards, "合計" + getTotal(enemyCards))
  console.log("勝敗決定フラグ", winOrLose)
}
