var json_keyword = document.getElementById("keyword").value;
var keyword = json_keyword
  .replace(/^\[|\]$/g, "")
  .replace(/\'/gi, "")
  .split(", ");

var word_list = [
  {
    text: keyword[0],
    weight: 20,
    url: "https://www.youtube.com/results?search_query=" + keyword[0],
  },
  {
    text: keyword[1],
    weight: 18,
    url: "https://www.youtube.com/results?search_query=" + keyword[1],
    title: "My Title",
  },
  {
    text: keyword[2],
    weight: 15,
    url: "https://www.youtube.com/results?search_query=" + keyword[2],
  },
  {
    text: keyword[3],
    weight: 15,
    url: "https://www.youtube.com/results?search_query=" + keyword[3],
  },
  {
    text: keyword[4],
    weight: 13,
    url: "https://www.youtube.com/results?search_query=" + keyword[4],
  },
  {
    text: keyword[5],
    weight: 10,
    url: "https://www.youtube.com/results?search_query=" + keyword[5],
  },
  {
    text: keyword[6],
    weight: 8,
    url: "https://www.youtube.com/results?search_query=" + keyword[6],
  },
  {
    text: keyword[7],
    weight: 8,
    url: "https://www.youtube.com/results?search_query=" + keyword[7],
  },
  {
    text: keyword[8],
    weight: 8,
    url: "https://www.youtube.com/results?search_query=" + keyword[8],
  },
  {
    text: keyword[9],
    weight: 8,
    url: "https://www.youtube.com/results?search_query=" + keyword[9],
  },
];
$(document).ready(function () {
  $("#my_favorite_latin_words").jQCloud(word_list);
});
