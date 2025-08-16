const GRAPHQL_ENDPOINT = "https://dev-web.ffau.to/graphql";
// const GRAPHQL_ENDPOINT = "http://localhost:8000/graphql";
const C10_DATA_QUERY = `
        query c10 {
    c10Index24h {
        index
        calculatedAt
    }
    c10LatestMarketData {
        id
        name
        symbol
        currentPrice
        marketCap
        marketCapChangePercentage24h
        weight
        updatedAt
    }
}
        `;
const C10_INDEX_HISTORY = `
query c10 {
    c10IndexHistory {
        index
        calculatedAt
    }
}
`;

const C10_INDEX_HISTORY_WITH_BITCOIN = `
query c10($coinId: String) {
    bitCoinIndexHistory: c10IndexHistory(coinId: $coinId) {
        index
        calculatedAt
    }
    c10IndexHistory {
        index
        calculatedAt
    }
}
`;

async function fetchData(query, variables) {
  if (!variables) {
    variables = {};
  }
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  return json.data;
}

export async function loadData(callback) {
  const data = await fetchData(C10_DATA_QUERY);

  // const before = data.c10Index24h[0].index;
  // const current = data.c10Index24h[data.c10Index24h.length - 1].index;
  // const change = (current - before) / before;
  // data.latest = {
  //   index: current,
  //   change,
  // }
  data.latest = calLatest(data);

  const isFirst = true;
  callback(data, isFirst);

  setInterval(async () => {
    const data2 = await fetchData(C10_DATA_QUERY);
    data2.latest = calLatest(data2);
    callback(data2, false);
  }, 10000)

}

export async function loadIndexHistory(callback) {
  const data = await fetchData(C10_INDEX_HISTORY);
  callback(data);
}

export async function loadIndexHistoryWithBitcoin(callback) {
  const data = await fetchData(C10_INDEX_HISTORY_WITH_BITCOIN, { coinId: 'nasdaq' });
  callback(data);
}
function calLatest(data) {
  const before = data.c10Index24h[0].index;
  const current = data.c10Index24h[data.c10Index24h.length - 1].index;
  const change = (current - before) / before;
  return {
    index: current,
    change,
  }
}