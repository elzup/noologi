const table = "ABCDEFGHJKLMNPQRSTUVWXY0123456789";
const randChar = () => table[Math.floor(Math.random() * table.length)];

export function genRandomStr(len = 5) {
  return [...Array(len).keys()].map(randChar).join("");
}
