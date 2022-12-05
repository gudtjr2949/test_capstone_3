var json_top5_text = document.getElementById("top5_text").value;
var json_low5_text = document.getElementById("low5_text").value;

var top5_text = json_top5_text
  .replace(/^\[|\]$/g, "")
  .replace(/\'/gi, "")
  .replace(/\\n/g, "<br/>")
  .split(", ");
var low5_text = json_low5_text
  .replace(/^\[|\]$/g, "")
  .replace(/\'/gi, "")
  .replace(/\\n/g, "<br/>")
  .split(", ");

var commentChar = document.getElementsByName("commentChar");
var topCmt1 = document.getElementById("topCmt1");
var topCmt2 = document.getElementById("topCmt2");
var topCmt3 = document.getElementById("topCmt3");
var topCmt4 = document.getElementById("topCmt4");
var topCmt5 = document.getElementById("topCmt5");

for (i = 0; i < commentChar.length; i++) {
  commentChar[i].addEventListener("click", function () {
    console.log("functionON");
    switch (this.id) {
      case "positive":
        topCmt1.innerHTML = top5_text[0];
        topCmt2.innerHTML = top5_text[1];
        topCmt3.innerHTML = top5_text[2];
        topCmt4.innerHTML = top5_text[3];
        topCmt5.innerHTML = top5_text[4];
        console.log("긍정선택");
        break;

      case "negative":
        topCmt1.innerHTML = low5_text[0];
        topCmt2.innerHTML = low5_text[1];
        topCmt3.innerHTML = low5_text[2];
        topCmt4.innerHTML = low5_text[3];
        topCmt5.innerHTML = low5_text[4];
        console.log("부정선택");
    }
  });
}

$(document).ready(function () {
  if ($("input[name='commentChar']:checked").val() == "positive") {
    topCmt1.innerHTML = top5_text[0];
    topCmt2.innerHTML = top5_text[1];
    topCmt3.innerHTML = top5_text[2];
    topCmt4.innerHTML = top5_text[3];
    topCmt5.innerHTML = top5_text[4];
    console.log("긍정선택");
  }
});
