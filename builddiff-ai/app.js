const diffs = [
  {
    title: "会議室Bの拡張は施工・設備・見積に影響します",
    text:
      "西側の間仕切りが900mm移動し、会議室Bの幅が4,200mmから5,100mmへ拡張されています。RAG検索では第8回定例会議の収容人数増加要望と整合しますが、空調能力と照明数量の見積反映が未確認です。",
    confidence: "信頼度 86%",
  },
  {
    title: "鉄筋工事の数量増により契約変更確認が必要です",
    text:
      "鉄筋工事が1,050tから1,180tに増加し、金額が24,200,000円増えています。仕様書3.1と見積内訳の合計は一致していますが、構造図改訂との因果関係と発注者承認の記録を確認してください。",
    confidence: "信頼度 91%",
  },
  {
    title: "玄関扉の開き勝手変更は避難動線の確認対象です",
    text:
      "玄関扉が外開きから右開きへ変更されています。混雑時の動線改善意図と推定されますが、防災計画、避難経路、有効幅に矛盾がないかを関連図面で確認してください。",
    confidence: "信頼度 78%",
  },
  {
    title: "BIM連携要件の追加は提出物と役割分担に影響します",
    text:
      "目次と用語定義にBIM関連要件が追加されています。監督員の説明が簡素化されているため、承認フロー、モデル提出範囲、責任分界が別紙に移動していないか確認が必要です。",
    confidence: "信頼度 83%",
  },
];

const viewButtons = document.querySelectorAll(".view-switch button");
const views = {
  workspace: document.getElementById("workspaceView"),
  summary: document.getElementById("summaryView"),
  knowledge: document.getElementById("knowledgeView"),
};

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    Object.values(views).forEach((view) => view.classList.remove("active"));
    views[button.dataset.view].classList.add("active");
  });
});

document.querySelectorAll(".diff-item").forEach((button) => {
  button.addEventListener("click", () => {
    const diff = diffs[Number(button.dataset.diff)];
    document.querySelectorAll(".diff-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.getElementById("aiTitle").textContent = diff.title;
    document.getElementById("aiText").textContent = diff.text;
    document.getElementById("confidence").textContent = diff.confidence;
  });
});

const progressCard = document.getElementById("progressCard");
const progressValue = document.getElementById("progressValue");
const progressBar = document.getElementById("progressBar");
const uploadScreen = document.getElementById("uploadScreen");
const reviewWorkspace = document.getElementById("reviewWorkspace");

function showProgress() {
  progressCard.classList.add("visible");
  let value = 12;
  const timer = window.setInterval(() => {
    value += 14;
    if (value >= 96) {
      value = 96;
      window.clearInterval(timer);
    }
    progressValue.textContent = `${value}%`;
    progressBar.style.width = `${value}%`;
  }, 260);
}

document.getElementById("analyzeButton").addEventListener("click", showProgress);
document.getElementById("sampleButton").addEventListener("click", showProgress);

function revealUploads() {
  document.getElementById("beforePreview").classList.add("visible");
  document.getElementById("afterPreview").classList.add("visible");
  document.getElementById("beforeUpload").querySelector("em").textContent = "追加済み";
  document.getElementById("afterUpload").querySelector("em").textContent = "追加済み";
}

function openWorkspace() {
  revealUploads();
  uploadScreen.classList.remove("active");
  reviewWorkspace.classList.add("active");
  showProgress();
}

document.getElementById("beforeUpload").addEventListener("click", () => {
  document.getElementById("beforePreview").classList.add("visible");
  document.getElementById("beforeUpload").querySelector("em").textContent = "追加済み";
});

document.getElementById("afterUpload").addEventListener("click", () => {
  document.getElementById("afterPreview").classList.add("visible");
  document.getElementById("afterUpload").querySelector("em").textContent = "追加済み";
});

document.getElementById("loadSampleButton").addEventListener("click", revealUploads);
document.getElementById("startReviewButton").addEventListener("click", openWorkspace);

document.querySelectorAll(".drop-zone").forEach((zone) => {
  zone.addEventListener("click", () => {
    zone.querySelector("em").textContent = "追加済み";
    zone.style.background = "rgba(255,255,255,0.92)";
  });
});
