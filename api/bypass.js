import { parse } from "cheerio";
import { request } from "undici";

export async function bypassHubCloud(url) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  };

  const res = await request(url, { headers });
  const html = await res.body.text();
  const $ = parse(html);

  const form = $("form");
  if (!form.length) {
    return { status: "error", message: "No download form found" };
  }

  const action = form.attr("action");
  const token = form.find("input[name='token']").attr("value");
  if (!action || !token) {
    return { status: "error", message: "Form action or token not found" };
  }

  const downloadUrl = new URL(action, url).href;

  const res2 = await request(downloadUrl, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `token=${token}`,
  });

  const finalHtml = await res2.body.text();
  const $final = parse(finalHtml);
  const finalLink = $final("a#download").attr("href");

  if (!finalLink) {
    return { status: "error", message: "Download link not found" };
  }

  return { status: "success", download: finalLink };
}
