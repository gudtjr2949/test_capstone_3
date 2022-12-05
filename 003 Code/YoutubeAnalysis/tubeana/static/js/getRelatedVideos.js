//슬라이드 아이템 세팅
var json_relation_thumbnails = document.getElementById(
    "relation_thumbnails"
).value;
var json_relation_title = document.getElementById("relation_title").value;
var json_relation_id = document.getElementById("relation_id").value;

var relation_thumbnails = json_relation_thumbnails
    .replace(/^\[|\]$/g, "")
    .replace(/\'/gi, "")
    .split(", ");
var relation_title = json_relation_title
    .replace(/^\[|\]$/g, "")
    .slice(1, -1)
    .split("', '");
var relation_id = json_relation_id
    .replace(/^\[|\]$/g, "")
    .replace(/\'/gi, "")
    .split(", ");

var slide_item1 = document.getElementById("slide_item1");
var slide_item2 = document.getElementById("slide_item2");
var slide_item3 = document.getElementById("slide_item3");
var slide_item4 = document.getElementById("slide_item4");
var slide_item5 = document.getElementById("slide_item5");


function copyToClipboard(val) {
    var t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = val;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    $('#copybtn1').click(function() {
      copyToClipboard(val)
      alert('주소를 복사하였습니다');
    });
}

for (var i = 1; i < relation_id.length + 1; i++) {
    eval("var item = slide_item" + i);
    item.innerHTML = `
  <div class="slide_card">
    <img class="card_thumbnail" src="${relation_thumbnails[i - 1]}"></img>
    <div
    class="card_title"
    title="${relation_title[i - 1]}"
    >
      <span class="card_title_span">
      ${relation_title[i - 1]}
      </span>
    </div>
    <div class="card_btn">
      <button class="button" onclick="window.open('https://www.youtube.com/watch?v=${
        relation_id[i - 1]
    }')">영상 보러가기</button>
      <button id="copybtn1" class="button" onclick="copyToClipboard('https://www.youtube.com/watch?v=${relation_id[i - 1]}'); alert('주소를 복사하였습니다')">주소 복사하기</button>
    </div>
  </div>`;
}

// 슬라이크 전체 크기(width 구하기)
const slide = document.querySelector(".slide");
let slideWidth = slide.clientWidth;

// 버튼 엘리먼트 선택하기
const prevBtn = document.querySelector(".slide_prev_button");
const nextBtn = document.querySelector(".slide_next_button");

// 슬라이드 전체를 선택해 값을 변경해주기 위해 슬라이드 전체 선택하기
const slideItems = document.querySelectorAll(".slide_item");
// 현재 슬라이드 위치가 슬라이드 개수를 넘기지 않게 하기 위한 변수
const maxSlide = slideItems.length;

// 버튼 클릭할 때 마다 현재 슬라이드가 어디인지 알려주기 위한 변수
let currSlide = 1;

// 페이지네이션 생성
const pagination = document.querySelector(".slide_pagination");

for (let i = 0; i < maxSlide; i++) {
    if (i === 0) pagination.innerHTML += `<li class="active">•</li>`;
    else pagination.innerHTML += `<li>•</li>`;
}

const paginationItems = document.querySelectorAll(".slide_pagination > li");
console.log(paginationItems);

// 버튼 엘리먼트에 클릭 이벤트 추가하기
nextBtn.addEventListener("click", () => {
    // 이후 버튼 누를 경우 현재 슬라이드를 변경
    currSlide++;
    // 마지막 슬라이드 이상으로 넘어가지 않게 하기 위해서
    if (currSlide <= maxSlide) {
        // 슬라이드를 이동시키기 위한 offset 계산
        const offset = slideWidth * (currSlide - 1);
        // 각 슬라이드 아이템의 left에 offset 적용
        slideItems.forEach((i) => {
            i.setAttribute("style", `left: ${-offset}px`);
        });
        // 슬라이드 이동 시 현재 활성화된 pagination 변경
        paginationItems.forEach((i) => i.classList.remove("active"));
        paginationItems[currSlide - 1].classList.add("active");
    } else {
        currSlide--;
    }
});
// 버튼 엘리먼트에 클릭 이벤트 추가하기
prevBtn.addEventListener("click", () => {
    // 이전 버튼 누를 경우 현재 슬라이드를 변경
    currSlide--;
    // 1번째 슬라이드 이하로 넘어가지 않게 하기 위해서
    if (currSlide > 0) {
        // 슬라이드를 이동시키기 위한 offset 계산
        const offset = slideWidth * (currSlide - 1);
        // 각 슬라이드 아이템의 left에 offset 적용
        slideItems.forEach((i) => {
            i.setAttribute("style", `left: ${-offset}px`);
        });
        // 슬라이드 이동 시 현재 활성화된 pagination 변경
        paginationItems.forEach((i) => i.classList.remove("active"));
        paginationItems[currSlide - 1].classList.add("active");
    } else {
        currSlide++;
    }
});

// 브라우저 화면이 조정될 때 마다 slideWidth를 변경하기 위해
window.addEventListener("resize", () => {
    slideWidth = slide.clientWidth;
});

// 각 페이지네이션 클릭 시 해당 슬라이드로 이동하기
for (let i = 0; i < maxSlide; i++) {
    // 각 페이지네이션마다 클릭 이벤트 추가하기
    paginationItems[i].addEventListener("click", () => {
        // 클릭한 페이지네이션에 따라 현재 슬라이드 변경해주기(currSlide는 시작 위치가 1이기 때문에 + 1)
        currSlide = i + 1;
        // 슬라이드를 이동시키기 위한 offset 계산
        const offset = slideWidth * (currSlide - 1);
        // 각 슬라이드 아이템의 left에 offset 적용
        slideItems.forEach((i) => {
            i.setAttribute("style", `left: ${-offset}px`);
        });
        // 슬라이드 이동 시 현재 활성화된 pagination 변경
        paginationItems.forEach((i) => i.classList.remove("active"));
        paginationItems[currSlide - 1].classList.add("active");
    });
}
