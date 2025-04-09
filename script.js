document.addEventListener("DOMContentLoaded", () => {
  const actions = {
    "우유 마셨다!": "우유 마시느라 고생했어!",
    "발표했다!": "발표하느라 정말 수고했어!",
    "양치했다!": "이를 깨끗이 닦다니 정말 멋지다!",
    "칭찬했다!": "다른 사람을 칭찬하다니 너무 착해!",
    "급식 다 먹었다!": "편식하지 않고 다 먹다니 최고야!",
  };

  const users = {};
  for (let i = 1; i <= 23; i++) users[`user${i}`] = "123";

  const loginBox = document.querySelector(".login");
  const appBox = document.querySelector(".app");
  const loginMsg = document.getElementById("login-msg");

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  function loadData() {
    return JSON.parse(localStorage.getItem("jea-data") || "{}");
  }

  function saveData(data) {
    localStorage.setItem("jea-data", JSON.stringify(data));
  }

  let currentUser = null;
  let data = loadData();

  function login() {
    const id = document.getElementById("username").value;
    const pw = document.getElementById("password").value;
    if (users[id] === pw) {
      currentUser = id;
      if (!data[id]) data[id] = { count: 0, month: currentMonth, lastClicked: {} };
      if (data[id].month !== currentMonth) {
        data[id].count = 0;
        data[id].month = currentMonth;
        data[id].lastClicked = {};
      }
      saveData(data);
      loginBox.style.display = "none";
      appBox.style.display = "flex";
      document.getElementById("greeting").innerText = `${id}님, 안녕하세요!`;
      updateStatus();
      showButtons();
    } else {
      loginMsg.innerText = "아이디 또는 비밀번호가 틀렸습니다.";
    }
  }

  function logout() {
    currentUser = null;
    loginBox.style.display = "flex";
    appBox.style.display = "none";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  }

  function resetCount() {
    if (currentUser && data[currentUser]) {
      data[currentUser].count = 0;
      data[currentUser].lastClicked = {};
      saveData(data);
      updateStatus();
      alert("카운트가 초기화되었습니다!");
    }
  }

  function showButtons() {
    const btnArea = document.getElementById("buttons");
    btnArea.innerHTML = "";
    Object.entries(actions).forEach(([text, msg]) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      btn.style.display = "block";
      btn.style.marginBottom = "10px";
      btn.onclick = () => {
        const nowSec = Math.floor(Date.now() / 1000);
        const last = data[currentUser].lastClicked?.[text] || 0;
        if (nowSec - last < 72000) {
          alert("20시간 뒤에 다시 누를 수 있어요!");
          return;
        }
        alert(msg);
        data[currentUser].count++;
        data[currentUser].lastClicked[text] = nowSec;
        saveData(data);
        updateStatus();
      };
      btnArea.appendChild(btn);
    });
  }

  function updateStatus() {
    const count = data[currentUser]?.count || 0;
    const rating = getRating(count);
    const all = Object.entries(data).map(([u, d]) => [u, d.count]);
    all.sort((a, b) => b[1] - a[1]);
    const rank = all.findIndex(([u]) => u === currentUser) + 1;

    const rankList = all.map(([u, c], i) => `${i + 1}등: ${u} (${c}점)`).join("\n");

    document.getElementById("count").innerText = `이번 달 누적 클릭 수: ${count}`;
    document.getElementById("rank").innerText = `나의 등수: ${rank}등, 신용 등급: ${rating}\n\n[전체 랭킹]\n${rankList}`;
  }

  function getRating(count) {
    if (count >= 100) return "1등급";
    if (count >= 90) return "2등급";
    if (count >= 80) return "3등급";
    if (count >= 70) return "4등급";
    if (count >= 60) return "5등급";
    if (count >= 50) return "6등급";
    if (count >= 40) return "7등급";
    if (count >= 30) return "8등급";
    return "9등급";
  }

  loginBox.style.display = "flex";
});
