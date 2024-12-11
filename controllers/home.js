const youtubeDl = require("youtube-dl-exec");
const {spawn} = require('child_process')

async function handleView(req, res) {
  res.send("Hello World!");
}

async function handleDownloadRequest(req, res) {
  try {
    const { url } = req.query; // Extract URL from request body

    if (!url) {
      // Validate the URL
      console.log("invalid url");
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    console.log(url);

    // Fetch video info and log details
    const videoInfo = await youtubeDl(url, { dumpSingleJson: true });
    const title = videoInfo.title || 'Default Title' // If it is coming from a request body

    .replace(/[\/\\:*?"<>|]/g, "_") // Remove invalid filename characters
    .substring(0, 255); // Limit filename length
    
    console.log(`${title}`);

     // Set headers for download
     res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
     res.setHeader("Content-Type", "video/mp4");


     // Use spawn to execute youtube-dl command manually
    const ytdlProcess = spawn("youtube-dl", [
      url,
      "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4", // Select best video and audio
      "-o", "-", // Output to stdout
    ]);

    // Pipe the stdout stream from the child process to the response
    ytdlProcess.stdout.pipe(res);

    // Handle any errors in the process
    ytdlProcess.on("error", (error) => {
      console.error("Stream Error:", error);
      res.status(500).json({ error: "Error during video streaming" });
    });

    // Handle the stderr if any errors occur during youtube-dl execution
    ytdlProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });



  //    // Use youtube-dl to stream video
  //    const stream = youtubeDl(url, {
  //     format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4", // Select the best format
  //     output: "-", // Output to stdout
  //   });

  //   // Pipe the stream to the response
  //   stream.stdout.pipe(res); // Use the stdout stream for piping the video to the response


  // stream.on("error", (error) => {
  //     console.error("Stream Error:", error);
  //     res.status(500).json({ error: "Error during video streaming" });
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
