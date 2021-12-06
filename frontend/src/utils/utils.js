const arrText = ["человек", "человека", "человек"];

export function formattingUserCount(num) {
  if (num % 10 === 1 && num % 100 !== 11) {
    return arrText[0];
  } else if (
    num % 10 >= 2 &&
    num % 10 <= 4 &&
    (num % 100 < 10 || num % 100 >= 20)
  ) {
    return arrText[1];
  }
  return arrText[2];
}

export function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
