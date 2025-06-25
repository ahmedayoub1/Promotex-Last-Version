const BASE_URL = "http://localhost:5015";

export async function apiRequest(url, options = {}) {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  // ✅ تسجيل تفاصيل الطلب
  console.log("🟡 API REQUEST");
  console.log("➡️ URL:", fullUrl);
  console.log("➡️ Method:", options.method || "GET");
  console.log("➡️ Headers:", options.headers);
  console.log("➡️ Body:", options.body);

  const rawResponse = await fetch(fullUrl, {
    ...options,
    credentials: "include", // لإرسال الكوكيز
  });

  const headers = rawResponse.headers;
  let data;

  try {
    data = await rawResponse.json();
  } catch (err) {
    data = null;
    console.warn("⚠️ Failed to parse JSON response");
  }

  // ✅ تسجيل تفاصيل الاستجابة
  console.log("🔵 API RESPONSE");
  console.log("⬅️ Status:", rawResponse.status);
  console.log("⬅️ Headers:", Object.fromEntries(headers.entries()));
  console.log("⬅️ Body:", data);

  if (!rawResponse.ok) {
    const message = (data && (data.message || data.title)) || "API request failed";
    console.error("🔴 Request failed with status:", rawResponse.status);
    console.error("🔴 Error message:", message);
    throw new Error(message);
  }

  return {
    data,
    headers,
    status: rawResponse.status,
  };
}
