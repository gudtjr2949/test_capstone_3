var json_likes_num = document.getElementById("likes").value;
var json_likes_text = document.getElementById("likes_text").value;

var likeCmt1 = document.getElementById("likeCmt1");
var likeCmt2 = document.getElementById("likeCmt2");
var likeCmt3 = document.getElementById("likeCmt3");
var likeCmt4 = document.getElementById("likeCmt4");
var likeCmt5 = document.getElementById("likeCmt5");

var likeNum1 = document.getElementById("likeNum1");
var likeNum2 = document.getElementById("likeNum2");
var likeNum3 = document.getElementById("likeNum3");
var likeNum4 = document.getElementById("likeNum4");
var likeNum5 = document.getElementById("likeNum5");

var likes_num = json_likes_num
  .replace(/^\[|\]$/g, "")
  .replace(/\'/gi, "")
  .split(", ");

var likes_text = json_likes_text
  .replace(/^\[|\]$/g, "")
  .replace(/\'/gi, "")
  .replace(/\\n/g, "<br/>")
  .split(", ");

function NumberToKorean(num) {
  var resultString = "";

  if (num < 1000) {
    resultString = num.toString();
  } else if (1000 <= num && num < 10000) {
    num = (Math.floor(num / 100) * 100).toString();
    if (num.slice(1, 2) == 0) {
      resultString = num.slice(0, 1) + "천";
    } else {
      resultString = num.slice(0, 1) + "." + num.slice(1, 2) + "천";
    }
  } else if (10000 <= num <= 100000) {
    num = (Math.floor(num / 1000) * 1000).toString();
    if (num.slice(1, 2) == 0) {
      resultString = num.slice(0, 1) + "만";
    } else {
      resultString = num.slice(0, 1) + "." + num.slice(1, 2) + "만";
    }
  } else if (100000 <= num) {
    num = (Math.floor(num / 10000) * 10000).toString();
    if (num.slice(1, 2) == 0) {
      resultString = num.slice(0, 1) + "만";
    } else {
      resultString = num.slice(0, 1) + "." + num.slice(1, 2) + "만";
    }
  }
  return resultString;
}

console.log(likes_num, typeof likes_num);
for (var i = 0; i < likes_num.length; i++) {
  likes_num[i] = NumberToKorean(parseInt(likes_num[i]));
}

likeCmt1.innerHTML = likes_text[0];
likeCmt2.innerHTML = likes_text[1];
likeCmt3.innerHTML = likes_text[2];
likeCmt4.innerHTML = likes_text[3];
likeCmt5.innerHTML = likes_text[4];

likeNum1.innerHTML = likes_num[0];
likeNum2.innerHTML = likes_num[1];
likeNum3.innerHTML = likes_num[2];
likeNum4.innerHTML = likes_num[3];
likeNum5.innerHTML = likes_num[4];
