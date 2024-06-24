/* ---------------------------------------
	JavaScriptによる神経衰弱ゲームの作成
	株式会社S.B.C.
   ---------------------------------------*/

/**************************/
/*     グローバル変数     */
/**************************/
var MAX_CARD_CNT  = 4;					// カード最大枚数
var MAX_TRY_CNT   = 5;					// 残り回数
var tryCnt        = MAX_TRY_CNT;		// 残り回数の変数
var fstCard = { obj : null, num : -1 };	// １枚目のカード
var sndCard = { obj : null, num : -1 };	// ２枚目のカード
var correctNum    = 0;					// そろえたカードの数
var currentNum    = 1;					// 現在の回数
var preFlg        = true;				// 同じカードを連打しないようのフラグ

/*消す用*/
function kesu(){
	if(c.classList.contains("n")){
		c.classList.remove("n");
		c.classList.add("h");
		l.classList.remove("n");
		l.classList.add("h");
		e.classList.remove("n");
		e.classList.add("h");
		a.classList.remove("n");
		a.classList.add("h");
		r.classList.remove("n");
		r.classList.add("h");
	}
}
/*取る用*/
function toru(){
	let c = document.getElementById("c");
	let l = document.getElementById("l");
	let e = document.getElementById("e");
	let a = document.getElementById("a");
	let r = document.getElementById("r");
}

$(function(){

	//スタートボタンを押すイベント
	$('.js-start').on('click', function() {
		setOption();
		let c = document.getElementById("c");
		if (initCheck()) {
			initCards();
			setText('スタート！');
			kesu();
		}
	});

	//リセットボタンを押すイベント
	$('.js-reset').on('click', function() {
		initCards();
		clearText();
		setText('リセット完了！');
		kesu();
	});

	//カード選択イベント
	$('.js-stage').on('click', 'li', function() {

		//連打防止
		if (!preFlg || $(this).data('itemVal') != '-1') {
			return false;
		}

		//デザインの変更
		var cardNum = $(this).data('num');
		$(this).data('itemVal', cardNum);
		$(this).removeClass('back-img');
		$(this).addClass('card' + cardNum + '-img');

		//最初のカードであれば比較用に値を保持
		if (fstCard.num == -1) {
			fstCard.num = cardNum;
			fstCard.obj = $(this);
		} else {
			//２枚目であれば合っているかを判定する
			sndCard.num = cardNum;
			sndCard.obj = $(this);
			preFlg = false;
			judgeCards();
		}
	});	
	initialize();
})

//カードの初期化
function initCards() {
	initialize();
	$('.js-stage').append(getTemplate());
}

//画面入力項目の反映
function setOption() {

	if (initCheck()) {
		MAX_CARD_CNT = $('#maxCardCnt').val();
		MAX_TRY_CNT = $('#tryCardCnt').val();
		initialize();
	}
}

//入力項目チェック処理
function initCheck() {

	if (!$.isNumeric($('#maxCardCnt').val())) {
		alert('カード最大枚数は数値で入力して下さい。');
		$('#maxCardCnt').val(MAX_CARD_CNT);
		$('#maxCardCnt').focus();
		return false;
	} else if (!$.isNumeric($('#tryCardCnt').val())) {
		alert('トライ最大枚数は数値で入力して下さい。');
		$('#tryCardCnt').val(MAX_TRY_CNT);
		$('#tryCardCnt').focus();
		return false;
	} else if ($('#maxCardCnt').val() % 2 != 0) {
		alert('カード最大枚数は偶数で指定して下さい。');
		$('#maxCardCnt').val(MAX_CARD_CNT);
		return false;
	} else if ($('#maxCardCnt').val() < 2) {
		alert('カード最大枚数は2以上を指定して下さい。');
		$('#maxCardCnt').val(MAX_CARD_CNT);
		return false;
	} else if ($('#maxCardCnt').val() > 28) {
		alert('カード最大枚数は28までです。');
		$('#maxCardCnt').val(MAX_CARD_CNT);
		return false;
	}
	
	return true;
}

//初期処理
function initialize() {
	tryCnt = MAX_TRY_CNT;
	$('.js-countTxt').text(tryCnt);
	$('.js-stage').html('');
	$('#maxCardCnt').val(MAX_CARD_CNT);
	$('#tryCardCnt').val(MAX_TRY_CNT);
	preFlg = true;
	correctNum = 0;
	currentNum = 1;
	fstCard = { obj : null, num : -1 };
	sndCard = { obj : null, num : -1 };
}

//配置するカードの作成
function getTemplate() {
	var list = '';

	/* */
	let x = MAX_CARD_CNT / 2 - 1;   /*カードの種類*/
	
	let random; /*乱数を入れる変数*/
	let i = 0;  /*インクリメント*/
	
	let cards = []; /*カードの値*/
	let atai = [];  /*カードが２枚以上でないようにする用*/
	let len = MAX_CARD_CNT;
	
	/*配列すべてに 0 を入れる*/
	for (let n = 0; n < len; n++){
		atai[n] = 0;
	}
	/*カードに数字を入れていく*/
	do{
		random = Math.round(Math.random() * x);
			if (atai[random] < 2) {
				cards[i] = random;
				atai[random]++;
				/*console.log(cards[i]);  数字が入っているか確認用*/
				i++;
			}
	}while(i < MAX_CARD_CNT);	
	
	for (var j = 0; j < MAX_CARD_CNT; j++) {
		list += '<li class="back-img card "data-num="' + cards[j] + '" data-item-val="-1"><div class="card'+cards[j]+'-img"></div></li>';
	}

	return list;
}

//判定
function judgeCards() {

	var fstCardImg = 'card' + fstCard.num + '-img';
	var sndCardImg = 'card' + sndCard.num + '-img';

	if (fstCard.num == sndCard.num) {
		correctNum++;
		preFlg = true;
		fstCard.obj.addClass('pair');
		sndCard.obj.addClass('pair');

		setText(currentNum + '回目：○');

		fstCard.obj.fadeOut(320,function(){$(this).fadeIn(320)});
		sndCard.obj.fadeOut(320,function(){$(this).fadeIn(320)});

		/*ゲームクリア時*/
		if (correctNum == MAX_CARD_CNT / 2) {
			toru();
			c.classList.remove("h");
			c.classList.add("n");
			l.classList.remove("h");
			l.classList.add("n");
			e.classList.remove("h");
			e.classList.add("n");
			a.classList.remove("h");
			a.classList.add("n");
			r.classList.remove("h");
			r.classList.add("n");

			setText('クリア！！');
			return false;
		}

	} else {
		tryCnt--;

		setText(currentNum + '回目：×');

		setTimeout(function() {
			$('.js-countTxt').text(tryCnt);
			fstCard.obj.data('itemVal', '-1');
			fstCard.obj.removeClass(fstCardImg);
			fstCard.obj.addClass('back-img');

			sndCard.obj.data('itemVal', '-1');
			sndCard.obj.removeClass(sndCardImg);
			sndCard.obj.addClass('back-img');

			/*ゲームオーバー時 */
			if (tryCnt == 0) {
				setText('ゲームオーバー...');
				alert('ゲームオーバー...');
			} else {
				preFlg = true;
			}
		}, 700);
	}
	
	currentNum++;
	fstCard.num = -1;
}

// メッセージをセットする
function setText(text) {
	var message = $('.message-text').text();
	var message = message + text + '\r\n';
	$('.message-text').text(message);
	textarea_bottom();
}

// メッセージをクリアする
function clearText() {
	$('.message-text').text('');
}

// テキストエリアのスクロールを移動する
function textarea_bottom(){
	var $obj = $(".message-text");
	if($obj.length == 0) return;
	$obj.scrollTop($obj[0].scrollHeight - $obj.height());
}