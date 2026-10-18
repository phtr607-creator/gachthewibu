const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("vi-VN").format(n) + "đ";
$("year").textContent = new Date().getFullYear();
$("denomination").addEventListener("change", () => $("amount").textContent = money(Number($("denomination").value)));
let token = localStorage.getItem("gachthewibu_token") || "";
let authMode = "login";
function setMessage(id, msg) { $(id).textContent = msg || ""; }
function updateAccount(user) {
  const logged = Boolean(user);
  $("userLabel").textContent = user ? user.email : "Khách truy cập";
  $("userSub").textContent = user ? (user.role === "admin" ? "Quản trị viên" : "Đã đăng nhập") : "Đăng nhập hoặc tạo tài khoản mới";
  $("accountBtn").textContent = logged ? "Tài khoản" : "Đăng nhập";
  $("loginBtn").classList.toggle("hidden", logged);
  $("registerBtn").classList.toggle("hidden", logged);
  $("historyBtn").classList.toggle("hidden", !logged);
  $("logoutBtn").classList.toggle("hidden", !logged);
}
async function api(path, options={}) {
  const headers = {"Content-Type":"application/json", ...(options.headers||{})};
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch(path, {...options, headers});
  const data = await res.json().catch(()=>({error:"Phản hồi máy chủ không hợp lệ."}));
  if (!res.ok) throw new Error(data.error || "Đã xảy ra lỗi.");
  return data;
}
async function refreshUser() {
  if (!token) { updateAccount(null); return; }
  try { const d = await api("/api/me"); updateAccount(d.user); }
  catch { token=""; localStorage.removeItem("gachthewibu_token"); updateAccount(null); }
}
function openAuth(mode) {
  authMode = mode;
  $("dialogTitle").textContent = mode === "login" ? "Đăng nhập" : "Tạo tài khoản";
  $("authSubmit").textContent = mode === "login" ? "Đăng nhập" : "Tạo tài khoản";
  $("password").autocomplete = mode === "login" ? "current-password" : "new-password";
  setMessage("authMessage", "");
  $("authDialog").showModal();
}
$("accountBtn").onclick = () => token ? $("historyBtn").click() : openAuth("login");
$("loginBtn").onclick = () => openAuth("login");
$("registerBtn").onclick = () => openAuth("register");
$("closeDialog").onclick = () => $("authDialog").close();
$("logoutBtn").onclick = () => { token=""; localStorage.removeItem("gachthewibu_token"); updateAccount(null); $("history").textContent="Đã đăng xuất."; };
$("authForm").addEventListener("submit", async e => {
  e.preventDefault(); setMessage("authMessage", "Đang xử lý...");
  try {
    const data = await api("/api/" + (authMode === "login" ? "login" : "register"), {method:"POST",body:JSON.stringify({email:$("email").value,password:$("password").value})});
    token=data.token; localStorage.setItem("gachthewibu_token",token); updateAccount(data.user); $("authDialog").close(); $("password").value="";
  } catch(err) { setMessage("authMessage",err.message); }
});
$("historyBtn").onclick = async () => {
  try {
    const d = await api("/api/transactions");
    $("history").innerHTML = d.transactions.length ? "<b>Lịch sử giao dịch</b><br>" + d.transactions.map(t => `#${t.id} · ${t.network} · ${money(t.denomination)} · ${t.status}`).join("<br>") : "Chưa có giao dịch.";
  } catch(err) { $("history").textContent=err.message; }
};
$("cardForm").addEventListener("submit", async e => {
  e.preventDefault();
  if (!token) { setMessage("formMessage","Bạn cần đăng nhập trước. Hãy tạo tài khoản hoặc đăng nhập."); openAuth("login"); return; }
  setMessage("formMessage","Đang kiểm tra kết nối...");
  try {
    const data = await api("/api/cards",{method:"POST",body:JSON.stringify({network:$("network").value,denomination:Number($("denomination").value),serial:$("serial").value,pin:$("pin").value})});
    setMessage("formMessage",data.message || "Máy chủ đã nhận phản hồi.");
  } catch(err) { setMessage("formMessage",err.message); }
});
refreshUser();