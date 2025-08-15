const GRAPHQL_ENDPOINT = "http://localhost:8000/graphql";
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


async function fetchData(query) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();
    return json.data;
}

export async function loadData(callback){
  const data = await fetchData(C10_DATA_QUERY);
  const isFirst = true;
  callback(data, isFirst);

  setInterval(async() => {
    const data2 = await fetchData(C10_DATA_QUERY);
    callback(data2, false);
  }, 30000)
}

export async function loadIndexHistory(callback) {
  const data = await fetchData(C10_INDEX_HISTORY);
  callback(data);
}
