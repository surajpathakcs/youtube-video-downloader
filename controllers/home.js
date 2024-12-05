const ytdl = require("ytdl-core");

async function handleView(req, res) {
  res.send("Hello World!");
}

async function handleDownloadRequest(req, res) {
  try {
    const { url } = req.query; // Extract URL from request body

    // Validate the URL
    const checkValidity = await ytdl.validateURL(url);
    console.log(checkValidity)

    console.log(url)
    if (!checkValidity) {
        console.log("invalid url")

      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    console.log("URL validation successful.");

    //Works Till here

    // Get video info
    ytdl.getInfo(videoURL, (err, info) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Video Title:", info.title);
      console.log("Video Duration:", info.length_seconds + "seconds");
      console.log("Available Formats:", info.formats);
    });

    console.log("Streaming started.");
  } catch (error) {
    console.error("Error during download:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
}

module.exports = {
  handleView,
  handleDownloadRequest,
};
