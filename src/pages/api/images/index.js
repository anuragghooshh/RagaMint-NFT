export default async function handler(req, res) {
  const { hash } = req.query;

  if (!hash) {
    return res.status(400).json({ error: "Missing hash parameter" });
  }

  // Define multiple gateways to try
  const gateways = [
    `https://gateway.pinata.cloud/ipfs/${hash}`,
    `https://ipfs.io/ipfs/${hash}`,
    `https://cloudflare-ipfs.com/ipfs/${hash}`,
    `https://dweb.link/ipfs/${hash}`,
  ];

  // Try gateways in sequence until one works
  for (const gateway of gateways) {
    try {
      const response = await fetch(gateway, {
        method: "GET",
        headers: { Accept: "image/*" },
      });

      if (response.ok) {
        // Get content type and set the right header
        const contentType = response.headers.get("content-type");
        res.setHeader("Content-Type", contentType || "image/png");

        // Set cache control for 1 week
        res.setHeader("Cache-Control", "public, max-age=604800");

        // Stream the image data
        const arrayBuffer = await response.arrayBuffer();
        res.status(200).send(Buffer.from(arrayBuffer));
        return;
      }
    } catch (error) {
      console.error(`Error fetching from ${gateway}:`, error);
      // Continue to the next gateway
    }
  }

  // If all gateways fail, send a fallback image
  res.status(404).json({ error: "Failed to retrieve image from all gateways" });
}
