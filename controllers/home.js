const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const { info } = require("console");

async function handleView(req, res) {
  res.send("Hello World!");
}

async function handleDownloadRequest(req, res) {
  try {
    const { url } = req.query; // Extract URL from request body
    const checkValidity = await ytdl.validateURL(url);
    if (!checkValidity) {
      // Validate the URL
      console.log("invalid url");
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    // Fetch video info and log details
    const videoInfo = await ytdl.getInfo(url);
    console.log("Video Information:");
    console.log("Title:", videoInfo.videoDetails.title);
    console.log("Length:", videoInfo.videoDetails.lengthSeconds + " seconds");
    console.log("View Count:", videoInfo.videoDetails.viewCount);
    console.log("Uploaded by:", videoInfo.videoDetails.ownerChannelName);

    // Set response headers
    const title = videoInfo.videoDetails.title
      .replace(/[\/\\:*?"<>|]/g, "_") // Remove invalid filename characters
      .substring(0, 255); // Limit filename length

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(title)}.mp4"`);

    // fs.createWriteStream(`video.mp4`)
    const stream = ytdl(url, {
      quality: "highest",
      filter: "audioandvideo",
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }
    });

    stream.on("info", (info) => {
      console.log("Format Selected : ", info.formats[0].qualityLabel);
    });
    stream.on("progress", (chunkLength, download, total) => {
      const progress = (download / total) * 100;
      console.log(`Progess : ${progress.toFixed(2)}%`);
    });
    stream.pipe(res);

    stream.on("end", () => {
      console.log("Video Downloaded Successfully");
    });

    console.log("reaches here too");

    stream.on("error", (error) => {
      console.log("Failed to Download");
      res.status(500).json({ error: "Failed to download video" });
    });
    // res.download(outputFile, sanitizedTitle, (err) => {
    //   if (err) console.error("Error sending file:", err);
    // });
  } catch (error) {
    console.error("Error during download:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
}

module.exports = {
  handleView,
  handleDownloadRequest,
};
