// const usernamePattern = /(@\w+)/g;

export const replaceFirstUsername = (content, username) => {
  const searchPattern = new RegExp(`(@${username})`, "i"); //eslint-ignore-line no-useless-escape
  console.log(searchPattern);
  return content.replace(searchPattern, "").trim();
};
