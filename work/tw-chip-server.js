const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HTML_PATH = path.join(ROOT, "outputs", "tw-chip-live.html");
const DATA_PATH = path.join(ROOT, "work", "tw-chip-data.json");
const PORT = Number(process.env.PORT || 8766);
const HOST = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const FETCH_TIMEOUT_MS = 12000;

const stockPool = [
  ["2382","廣達","AI","AI 伺服器 ODM"],["6669","緯穎","AI","AI 伺服器 ODM"],["3231","緯創","AI","AI 伺服器 ODM"],["2317","鴻海","AI","AI 伺服器 ODM"],["2356","英業達","AI","AI 伺服器 ODM"],["2324","仁寶","AI","AI 伺服器 ODM"],["3706","神達","AI","AI 伺服器 ODM"],
  ["2357","華碩","AI","AI PC / 高階主機板"],["2376","技嘉","AI","AI PC / 高階主機板"],["2377","微星","AI","AI PC / 高階主機板"],["3515","華擎","AI","AI PC / 高階主機板"],
  ["8210","勤誠","AI","機殼 / 機構件"],["3013","晟銘電","AI","機殼 / 機構件"],["3693","營邦","AI","機殼 / 機構件"],["6117","迎廣","AI","機殼 / 機構件"],
  ["3017","奇鋐","AI","散熱 / 液冷 / 水冷"],["3324","雙鴻","AI","散熱 / 液冷 / 水冷"],["2421","建準","AI","散熱 / 液冷 / 水冷"],["6230","尼得科超眾","AI","散熱 / 液冷 / 水冷"],["8996","高力","AI","散熱 / 液冷 / 水冷"],["3653","健策","AI","散熱 / 液冷 / 水冷"],["6805","富世達","AI","散熱 / 液冷 / 水冷"],
  ["2368","金像電","AI","PCB / CCL / 高速板材"],["2313","華通","AI","PCB / CCL / 高速板材"],["3715","定穎投控","AI","PCB / CCL / 高速板材"],["6191","精成科","AI","PCB / CCL / 高速板材"],["5469","瀚宇博","AI","PCB / CCL / 高速板材"],["3044","健鼎","AI","PCB / CCL / 高速板材"],["2383","台光電","AI","PCB / CCL / 高速板材"],["6274","台燿","AI","PCB / CCL / 高速板材"],["6213","聯茂","AI","PCB / CCL / 高速板材"],["6672","騰輝電子-KY","AI","PCB / CCL / 高速板材"],
  ["3037","欣興","AI","ABF 載板 / 先進封裝"],["3189","景碩","AI","ABF 載板 / 先進封裝"],["8046","南電","AI","ABF 載板 / 先進封裝"],["2330","台積電","AI","ABF 載板 / 先進封裝"],["3711","日月光投控","AI","ABF 載板 / 先進封裝"],["2449","京元電子","AI","ABF 載板 / 先進封裝"],["6257","矽格","AI","ABF 載板 / 先進封裝"],["6239","力成","AI","ABF 載板 / 先進封裝"],["6223","旺矽","AI","ABF 載板 / 先進封裝"],["6515","穎崴","AI","ABF 載板 / 先進封裝"],["6510","精測","AI","ABF 載板 / 先進封裝"],["6683","雍智科技","AI","ABF 載板 / 先進封裝"],
  ["2308","台達電","AI","電源 / 供電 / BBU / UPS"],["2301","光寶科","AI","電源 / 供電 / BBU / UPS"],["6412","群電","AI","電源 / 供電 / BBU / UPS"],["6282","康舒","AI","電源 / 供電 / BBU / UPS"],["3015","全漢","AI","電源 / 供電 / BBU / UPS"],["3617","碩天","AI","電源 / 供電 / BBU / UPS"],["1513","中興電","AI","電源 / 供電 / BBU / UPS"],["1519","華城","AI","電源 / 供電 / BBU / UPS"],["1503","士電","AI","電源 / 供電 / BBU / UPS"],["1514","亞力","AI","電源 / 供電 / BBU / UPS"],["1504","東元","AI","電源 / 供電 / BBU / UPS"],
  ["3081","聯亞","AI","CPO / 矽光子 / 光通訊"],["3363","上詮","AI","CPO / 矽光子 / 光通訊"],["3163","波若威","AI","CPO / 矽光子 / 光通訊"],["4979","華星光","AI","CPO / 矽光子 / 光通訊"],["3450","聯鈞","AI","CPO / 矽光子 / 光通訊"],["6442","光聖","AI","CPO / 矽光子 / 光通訊"],["6789","采鈺","AI","CPO / 矽光子 / 光通訊"],["4977","眾達-KY","AI","CPO / 矽光子 / 光通訊"],["4908","前鼎","AI","CPO / 矽光子 / 光通訊"],["2345","智邦","AI","CPO / 矽光子 / 光通訊"],["3558","神準","AI","CPO / 矽光子 / 光通訊"],["5388","中磊","AI","CPO / 矽光子 / 光通訊"],["3596","智易","AI","CPO / 矽光子 / 光通訊"],
  ["3661","世芯-KY","AI","ASIC / IC 設計 / IP"],["3443","創意","AI","ASIC / IC 設計 / IP"],["3035","智原","AI","ASIC / IC 設計 / IP"],["2454","聯發科","AI","ASIC / IC 設計 / IP"],["3529","力旺","AI","ASIC / IC 設計 / IP"],["6643","M31","AI","ASIC / IC 設計 / IP"],["6533","晶心科","AI","ASIC / IC 設計 / IP"],
  ["2408","南亞科","AI","記憶體 / HBM / DRAM / NAND"],["2344","華邦電","AI","記憶體 / HBM / DRAM / NAND"],["2337","旺宏","AI","記憶體 / HBM / DRAM / NAND"],["3260","威剛","AI","記憶體 / HBM / DRAM / NAND"],["4967","十銓","AI","記憶體 / HBM / DRAM / NAND"],["8271","宇瞻","AI","記憶體 / HBM / DRAM / NAND"],["2451","創見","AI","記憶體 / HBM / DRAM / NAND"],["8088","品安","AI","記憶體 / HBM / DRAM / NAND"],["8299","群聯","AI","記憶體 / HBM / DRAM / NAND"],
  ["3665","貿聯-KY","AI","連接器 / 線材 / 高速傳輸"],["3023","信邦","AI","連接器 / 線材 / 高速傳輸"],["6197","佳必琪","AI","連接器 / 線材 / 高速傳輸"],["6205","詮欣","AI","連接器 / 線材 / 高速傳輸"],["3526","凡甲","AI","連接器 / 線材 / 高速傳輸"],["3605","宏致","AI","連接器 / 線材 / 高速傳輸"],["6290","良維","AI","連接器 / 線材 / 高速傳輸"],
  ["6285","啟碁","低軌衛星","網通 / 低軌衛星"],["3491","昇達科","低軌衛星","低軌衛星"],["3138","耀登","低軌衛星","低軌衛星"],["2314","台揚","低軌衛星","低軌衛星"],["6271","同欣電","低軌衛星","低軌衛星"],["3105","穩懋","低軌衛星","低軌衛星"],["8086","宏捷科","低軌衛星","低軌衛星"],
  ["2395","研華","AI","機器人 / 自動化 / AI 終端"],["8374","羅昇","AI","機器人 / 自動化 / AI 終端"],["2464","盟立","AI","機器人 / 自動化 / AI 終端"],["2049","上銀","AI","機器人 / 自動化 / AI 終端"],["1597","直得","AI","機器人 / 自動化 / AI 終端"],["1590","亞德客-KY","AI","機器人 / 自動化 / AI 終端"],["6188","廣明","AI","機器人 / 自動化 / AI 終端"],["4540","全球傳動","AI","機器人 / 自動化 / AI 終端"],["6166","凌華","AI","機器人 / 自動化 / AI 終端"]
].map(([symbol, name, theme, subgroup]) => ({ symbol, name, theme, subgroup }));

const uniqueStockPool = [...new Map(stockPool.map(item => [item.symbol, item])).values()];

function cleanNumber(value) {
  if (value == null) return null;
  const text = String(value).replace(/,/g, "").replace(/\+/g, "").trim();
  if (!text || text.includes("---")) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

function rocToIso(value) {
  const text = String(value || "").trim();
  if (!/^\d{7}$/.test(text)) return "";
  return `${Number(text.slice(0, 3)) + 1911}-${text.slice(3, 5)}-${text.slice(5, 7)}`;
}

function ymd(date) {
  return String(date || "").replaceAll("-", "");
}

function todayYmd(offsetDays = 0) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const tw = new Date(utc + 8 * 3600000 - offsetDays * 86400000);
  return `${tw.getFullYear()}${String(tw.getMonth() + 1).padStart(2, "0")}${String(tw.getDate()).padStart(2, "0")}`;
}

function isoFromYmd(value) {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function tpexRocDateParam(value) {
  return `${Number(value.slice(0, 4)) - 1911}/${value.slice(4, 6)}/${value.slice(6, 8)}`;
}

async function json(url, label = url, options = {}) {
  const attempts = options.attempts || 3;
  const timeoutMs = options.timeoutMs || FETCH_TIMEOUT_MS;
  let lastError;
  let requestUrl = url;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(requestUrl, {
        headers: {
          "accept": "application/json,text/plain,*/*",
          "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "user-agent": "Mozilla/5.0 local chip analyzer",
          ...(options.headers || {})
        },
        redirect: "follow",
        signal: controller.signal
      });
      clearTimeout(timer);
      const text = await res.text();
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
        requestUrl = new URL(res.headers.get("location"), requestUrl).href;
        attempt -= 1;
        continue;
      }
      if (!res.ok) throw new Error(`${label} HTTP ${res.status}`);
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, attempt * 500));
    }
  }
  throw new Error(`${label} 下載失敗：${lastError?.message || lastError}`);
}

async function optionalJson(url, label, warnings) {
  try {
    return await json(url, label);
  } catch (error) {
    warnings.push(`${label} 暫時無法取得，已略過此欄位`);
    return [];
  }
}

function indexBy(rows, key) {
  const map = new Map();
  for (const row of rows || []) map.set(String(row[key] || "").trim(), row);
  return map;
}

function signFromHtml(value) {
  const text = String(value || "").replace(/<[^>]+>/g, "").trim();
  return text.includes("-") ? -1 : 1;
}

function twseCloseTable(payload) {
  const table = (payload.tables || []).find(t => Array.isArray(t.fields) && t.fields[0] === "證券代號" && t.fields.includes("收盤價"));
  const map = new Map();
  if (!table) return { map, date: "" };
  const f = table.fields;
  for (const row of table.data || []) {
    const magnitude = cleanNumber(row[f.indexOf("漲跌價差")]);
    const symbol = String(row[f.indexOf("證券代號")] || "").trim();
    map.set(symbol, {
      Date: payload.date,
      Code: symbol,
      Name: String(row[f.indexOf("證券名稱")] || "").trim(),
      ClosingPrice: row[f.indexOf("收盤價")],
      Change: magnitude == null ? null : signFromHtml(row[f.indexOf("漲跌(+/-)")]) * magnitude
    });
  }
  return { map, date: payload.date };
}

async function latestTwseClose() {
  for (let offset = 0; offset < 10; offset += 1) {
    const date = todayYmd(offset);
    const payload = await json(`https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${date}&type=ALLBUT0999&response=json`, `上市每日收盤 ${date}`);
    const parsed = twseCloseTable(payload);
    if (parsed.map.size) return parsed;
  }
  throw new Error("找不到最近上市每日收盤資料");
}

function appendCloseHistory(target, symbol, date, close) {
  if (!symbol || close == null) return;
  if (!target.has(symbol)) target.set(symbol, []);
  const rows = target.get(symbol);
  if (!rows.some(row => row.date === date)) rows.push({ date, close });
}

async function recentCloseHistory(warnings) {
  const twse = new Map();
  const tpex = new Map();
  let twseDays = 0;
  let tpexDays = 0;

  const fast = { attempts: 1, timeoutMs: 4500 };
  for (let offset = 0; offset < 10 && (twseDays < 5 || tpexDays < 5); offset += 1) {
    const date = todayYmd(offset);
    if (twseDays < 5) {
      try {
        const payload = await json(`https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${date}&type=ALLBUT0999&response=json`, `上市五日線 ${date}`, fast);
        const parsed = twseCloseTable(payload);
        if (parsed.map.size) {
          twseDays += 1;
          for (const [symbol, row] of parsed.map) appendCloseHistory(twse, symbol, isoFromYmd(parsed.date), cleanNumber(row.ClosingPrice));
        }
      } catch {}
    }

    if (tpexDays < 5) {
      try {
        const rows = await json(`https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes?d=${tpexRocDateParam(date)}`, `上櫃五日線 ${date}`, fast);
        if (Array.isArray(rows) && rows.length) {
          tpexDays += 1;
          for (const row of rows) appendCloseHistory(tpex, String(row.SecuritiesCompanyCode || "").trim(), rocToIso(row.Date), cleanNumber(row.Close));
        }
      } catch {}
    }
  }

  if (twseDays < 5) warnings.push(`上市五日線僅取得 ${twseDays}/5 個交易日`);
  if (tpexDays < 5) warnings.push(`上櫃五日線僅取得 ${tpexDays}/5 個交易日`);
  for (const rows of [...twse.values(), ...tpex.values()]) rows.sort((a, b) => a.date.localeCompare(b.date));
  return { twse, tpex };
}

async function yahooCloseHistory(symbol, market, maxDate) {
  const suffix = market === "twse" ? "TW" : "TWO";
  const payload = await json(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.${suffix}?range=14d&interval=1d`, `Yahoo五日線 ${symbol}`, { attempts: 1, timeoutMs: 4500 });
  const result = payload.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close || [];
  return timestamps
    .map((timestamp, index) => ({ date: new Date(timestamp * 1000).toISOString().slice(0, 10), close: cleanNumber(closes[index]) }))
    .filter(row => row.close != null)
    .filter(row => !maxDate || row.date <= maxDate)
    .slice(-5);
}

async function yahooLatestClose(symbol, market, maxDate) {
  const history = await yahooCloseHistory(symbol, market, maxDate);
  const latest = history.at(-1);
  if (!latest) return null;
  const previous = history.at(-2);
  return {
    Date: latest.date,
    Close: latest.close,
    Change: previous ? latest.close - previous.close : null,
    closeHistory: history,
    source: "Yahoo"
  };
}

async function fillMissingCloseHistory(records, warnings) {
  const targets = records.filter(row => (row.closeHistory || []).length < 5);
  const workerCount = 24;
  const workers = Array.from({ length: workerCount }, async (_, workerIndex) => {
    for (let index = workerIndex; index < targets.length; index += workerCount) {
      const row = targets[index];
      try {
        const history = await yahooCloseHistory(row.symbol, row.market, row.date);
        if (history.length >= 5) {
          row.closeHistory = history;
          row.closeHistorySource = "Yahoo";
        }
      } catch {}
    }
  });
  await Promise.all(workers);
  const filled = records.filter(row => row.closeHistorySource === "Yahoo").length;
  if (filled) warnings.push(`五日線有 ${filled} 檔以 Yahoo 日K補足`);
}

function twseInstMap(payload) {
  const map = new Map();
  const f = payload.fields || [];
  for (const row of payload.data || []) {
    const symbol = String(row[f.indexOf("證券代號")] || "").trim();
    const foreign = cleanNumber(row[f.indexOf("外陸資買賣超股數(不含外資自營商)")]);
    const trust = cleanNumber(row[f.indexOf("投信買賣超股數")]);
    const dealer = cleanNumber(row[f.indexOf("自營商買賣超股數")]);
    map.set(symbol, {
      foreign: foreign == null ? null : Math.round(foreign / 1000),
      trust: trust == null ? null : Math.round(trust / 1000),
      dealer: dealer == null ? null : Math.round(dealer / 1000)
    });
  }
  return map;
}

function tpexInstMap(rows) {
  const map = new Map();
  for (const row of rows || []) {
    const symbol = String(row.SecuritiesCompanyCode || "").trim();
    const foreign = cleanNumber(row["ForeignInvestorsInclude MainlandAreaInvestors-Difference"] ?? row["ForeignInvestorsIncludeMainlandAreaInvestors-Difference"]);
    const trust = cleanNumber(row["SecuritiesInvestmentTrustCompanies-Difference"]);
    const dealer = cleanNumber(row["Dealers-Difference"]);
    map.set(symbol, {
      foreign: foreign == null ? null : Math.round(foreign / 1000),
      trust: trust == null ? null : Math.round(trust / 1000),
      dealer: dealer == null ? null : Math.round(dealer / 1000)
    });
  }
  return map;
}

async function cachedTwseInst(date) {
  const cachePath = path.join(ROOT, "work", `twse-t86-${date}.json`);
  try {
    return JSON.parse(await fs.readFile(cachePath, "utf8"));
  } catch {
    return null;
  }
}

function twseMarginMap(payload) {
  const map = new Map();
  const table = (payload.tables || []).find(item => {
    return Array.isArray(item.fields)
      && item.fields[0] === "代號"
      && item.fields[1] === "名稱"
      && item.fields.includes("資券互抵");
  });
  if (!table) return map;
  for (const row of table.data || []) {
    const symbol = String(row[0] || "").trim();
    if (!symbol) continue;
    map.set(symbol, {
      marginBalance: cleanNumber(row[6]),
      shortBalance: cleanNumber(row[12])
    });
  }
  return map;
}

async function marketContext() {
  const pack = await latestTwseClose();
  const payload = await json(`https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${pack.date}&type=ALLBUT0999&response=json`, "大盤指數");
  const table = (payload.tables || []).find(t => Array.isArray(t.fields) && t.fields[0] === "指數" && t.fields.includes("漲跌百分比(%)"));
  const row = table?.data?.find(item => String(item[0]).trim() === "發行量加權股價指數");
  if (!row) return null;
  const f = table.fields;
  return {
    date: `${pack.date.slice(0,4)}-${pack.date.slice(4,6)}-${pack.date.slice(6,8)}`,
    name: "發行量加權股價指數",
    close: cleanNumber(row[f.indexOf("收盤指數")]),
    change: signFromHtml(row[f.indexOf("漲跌(+/-)")]) * Math.abs(cleanNumber(row[f.indexOf("漲跌點數")])),
    changePercent: signFromHtml(row[f.indexOf("漲跌(+/-)")]) * Math.abs(cleanNumber(row[f.indexOf("漲跌百分比(%)")]))
  };
}

async function readStore() {
  try {
    const parsed = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
    return { stockPool: uniqueStockPool, ...parsed };
  } catch {
    return { stockPool: uniqueStockPool, updatedAt: null, message: "尚未更新。", records: [], market: null };
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function updateData() {
  const sourceWarnings = [];
  const [twseClosePack, tpexClose, tpexInst, tpexMargin] = await Promise.all([
    latestTwseClose(),
    optionalJson("https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes", "上櫃收盤", sourceWarnings),
    optionalJson("https://www.tpex.org.tw/openapi/v1/tpex_3insti_daily_trading", "上櫃三大法人", sourceWarnings),
    optionalJson("https://www.tpex.org.tw/openapi/v1/tpex_mainboard_margin_balance", "上櫃融資融券", sourceWarnings)
  ]);

  const twseDate = `${twseClosePack.date.slice(0,4)}-${twseClosePack.date.slice(4,6)}-${twseClosePack.date.slice(6,8)}`;
  let twseMarginByCode = new Map();
  try {
    const twseMargin = await json(`https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=${ymd(twseDate)}&selectType=ALL&response=json`, "上市融資融券");
    twseMarginByCode = twseMargin.stat === "OK" ? twseMarginMap(twseMargin) : new Map();
    if (twseMargin.stat !== "OK") sourceWarnings.push(`上市融資融券 ${twseDate} 尚未發布`);
  } catch (error) {
    sourceWarnings.push("上市融資融券 暫時無法取得，已略過此欄位");
  }
  let twseInstByCode = new Map();
  try {
    const twseInst = await json(`https://www.twse.com.tw/rwd/zh/fund/T86?date=${ymd(twseDate)}&selectType=ALLBUT0999&response=json`, "上市三大法人", {
      attempts: 4,
      timeoutMs: 60000,
      headers: {
        "referer": "https://www.twse.com.tw/zh/trading/foreign/t86.html"
      }
    });
    twseInstByCode = twseInst.stat === "OK" ? twseInstMap(twseInst) : new Map();
    if (twseInst.stat !== "OK") sourceWarnings.push(`上市三大法人 ${twseDate} 尚未發布`);
  } catch (error) {
    const cached = await cachedTwseInst(ymd(twseDate));
    if (cached?.stat === "OK") {
      twseInstByCode = twseInstMap(cached);
      sourceWarnings.push(`上市三大法人以 ${twseDate} 官方快取補足`);
    } else {
      sourceWarnings.push("上市三大法人暫時無法取得，已略過此欄位");
    }
  }
  const tpexInstByCode = tpexInstMap(tpexInst);
  const tpexCloseByCode = indexBy(tpexClose, "SecuritiesCompanyCode");
  const tpexMarginByCode = indexBy(tpexMargin, "SecuritiesCompanyCode");
  const closeHistory = await recentCloseHistory(sourceWarnings);
  const sourceAvailable = {
    twseInst: twseInstByCode.size > 0,
    tpexInst: tpexInstByCode.size > 0,
    twseMargin: twseMarginByCode.size > 0,
    tpexMargin: tpexMarginByCode.size > 0
  };
  const records = [];
  const warnings = [...sourceWarnings];
  let yahooTpexFallbacks = 0;

  for (const stock of uniqueStockPool) {
    let market = twseClosePack.map.has(stock.symbol) ? "twse" : tpexCloseByCode.has(stock.symbol) ? "tpex" : null;
    let yahooClose = null;
    if (!market && !twseClosePack.map.has(stock.symbol)) {
      yahooClose = await yahooLatestClose(stock.symbol, "tpex", twseDate);
      if (yahooClose) {
        market = "tpex";
        yahooTpexFallbacks += 1;
      }
    }
    if (!market) {
      warnings.push(`${stock.symbol} ${stock.name} 無上市櫃收盤資料`);
      continue;
    }
    const closeRow = market === "twse" ? twseClosePack.map.get(stock.symbol) : (tpexCloseByCode.get(stock.symbol) || yahooClose);
    const marginRow = market === "twse" ? twseMarginByCode.get(stock.symbol) : tpexMarginByCode.get(stock.symbol);
    const inst = market === "twse" ? twseInstByCode.get(stock.symbol) : tpexInstByCode.get(stock.symbol);
    if (!inst && (market === "twse" ? sourceAvailable.twseInst : sourceAvailable.tpexInst)) warnings.push(`${stock.symbol} ${stock.name} 無三大法人資料`);
    if (!marginRow && (market === "twse" ? sourceAvailable.twseMargin : sourceAvailable.tpexMargin)) warnings.push(`${stock.symbol} ${stock.name} 無融資融券資料`);
    const date = market === "twse" ? twseDate : (closeRow.source === "Yahoo" ? closeRow.Date : rocToIso(closeRow.Date));
    records.push({
      ...stock,
      market,
      date,
      close: cleanNumber(market === "twse" ? closeRow.ClosingPrice : closeRow.Close),
      change: cleanNumber(closeRow.Change),
      foreign: inst?.foreign ?? null,
      trust: inst?.trust ?? null,
      dealer: inst?.dealer ?? null,
      margin: cleanNumber(market === "twse" ? marginRow?.marginBalance : marginRow?.MarginPurchaseBalance),
      short: cleanNumber(market === "twse" ? marginRow?.shortBalance : marginRow?.ShortSaleBalance),
      closeHistory: closeRow.closeHistory || (market === "twse" ? closeHistory.twse : closeHistory.tpex).get(stock.symbol) || [],
      closeSource: closeRow.source || undefined
    });
  }

  if (yahooTpexFallbacks) warnings.push(`上櫃收盤有 ${yahooTpexFallbacks} 檔以 Yahoo 日K補足`);
  await fillMissingCloseHistory(records, warnings);
  const market = await marketContext();
  const tpexDate = rocToIso(tpexClose[0]?.Date) || records.filter(row => row.market === "tpex").map(row => row.date).sort().at(-1) || "未知";
  const store = {
    stockPool: uniqueStockPool,
    updatedAt: new Date().toISOString(),
    market,
    records,
    message: `已更新 ${records.length}/${uniqueStockPool.length} 檔真實公開資料。上市收盤/T86 ${twseDate}，上櫃收盤 ${tpexDate}；三大法人股數已換算為張。${market ? ` 大盤 ${market.date} ${market.changePercent}%。` : ""}${warnings.length ? ` 注意：${warnings.slice(0, 8).join("、")}${warnings.length > 8 ? ` 等 ${warnings.length} 項` : ""}` : ""}`
  };
  await writeStore(store);
  return store;
}

async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    if (url.pathname === "/" || url.pathname === "/tw-chip-live.html") {
      const html = await fs.readFile(HTML_PATH, "utf8");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      res.end(html);
    } else if (url.pathname === "/api/data") {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      res.end(JSON.stringify(await readStore()));
    } else if (url.pathname === "/api/update" && req.method === "POST") {
      const store = await updateData();
      res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      res.end(JSON.stringify(store));
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  } catch (error) {
    const body = JSON.stringify({ error: String(error?.message || error) });
    if (res.headersSent) {
      res.end(body);
      return;
    }
    res.writeHead(500, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    res.end(body);
  }
}

http.createServer(handler).listen(PORT, HOST, () => {
  const shownHost = HOST === "0.0.0.0" ? "127.0.0.1" : HOST;
  console.log(`台股題材籌碼排名：http://${shownHost}:${PORT}/`);
});
