const youtubeDl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");

async function handleView(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
}

async function handleDownloadRequest(req, res) {
  try {
    const { url, format } = req.body;

    // Simple basic URL validation
    if (!url || !url.includes('youtube.com')) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    // Ensure downloads directory exists
    const downloadDir = path.join(__dirname, '..', 'downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }

    // Fetch video info
    const videoInfo = await youtubeDl(url, { dumpSingleJson: true });

    // Sanitize filename
    const sanitizedTitle = videoInfo.title
      .replace(/[\/\\:*?"<>|]/g, "_")
      .substring(0, 255);

    // Prepare download options
    const outputPath = path.join(downloadDir, `${sanitizedTitle}.%(ext)s`);
    
    // Download video
    await youtubeDl(url, {
      output: outputPath,
      format: format || 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4'
    });

    // Find the downloaded file
    const downloadedFiles = fs.readdirSync(downloadDir)
      .filter(file => file.startsWith(sanitizedTitle));

    res.json({
      message: "Download successful",
      filename: downloadedFiles[0] || `${sanitizedTitle}.mp4`,
      path: path.join(downloadDir, downloadedFiles[0] || `${sanitizedTitle}.mp4`)
    });

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download video", details: error.message });
  }
}

module.exports = {
  handleView,
  handleDownloadRequest,
};