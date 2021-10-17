const vercelRegions = {
  dev1: "Development",
  arn1: "Stockholm, Sweden",
  bom1: "Mumbai, India",
  cdg1: "Paris, France",
  cle1: "Cleveland, USA",
  dub1: "Dublin, Ireland",
  fra1: "Frankfurt, Germany",
  gru1: "São Paulo, Brazil",
  hkg1: "Hong Kong",
  hnd1: "Tokyo, Japan",
  iad1: "Washington, D.C., USA",
  icn1: "Seoul, South Korea",
  lhr1: "London, United Kingdom",
  pdx1: "Portland, USA",
  sfo1: "San Francisco, USA",
  sin1: "Singapore",
  syd1: "Sydney, Australia",
};

// Warning: This will mistakenly return "Development"
// if not deploying on Vercel
export const getVercelRegion = (res) => {
  console.log("a", res.headers);

  const header = res.headers.get("x-vercel-id");

  console.log("1", res.headers.get("x-vercel-id"));

  if (!header || header === "") {
    return "Development";
  }

  let regionKey = "";
  try {
    regionKey = header
      .split(":")
      .filter((x) => x !== "")
      .slice(-2)[0];
  } catch {
    return "Unknown";
  }

  if (regionKey in vercelRegions) {
    return vercelRegions[regionKey];
  } else {
    return regionKey;
  }
};
