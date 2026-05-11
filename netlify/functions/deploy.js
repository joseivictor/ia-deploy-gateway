exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const body = JSON.parse(event.body || "{}");
  const html = body.html;
  const message = body.message || "Deploy via IA";

  if (!html) {
    return { statusCode: 400, body: "HTML ausente" };
  }

  const owner = "joseivictor";
  const repo = "ia-deploy-gateway";
  const path = "index.html";
  const branch = "main";
  const token = process.env.GITHUB_TOKEN;

  const current = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json"
      }
    }
  );

  const currentData = await current.json();

  const payload = {
    message,
    content: Buffer.from(html).toString("base64"),
    branch,
    sha: currentData.sha
  };

  const update = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const result = await update.json();

  return {
    statusCode: update.ok ? 200 : update.status,
    body: JSON.stringify(result)
  };
};
