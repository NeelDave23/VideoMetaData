const express = require("express");
const multer = require("multer");
const { getVideoDurationInSeconds } = require("get-video-duration");
const exiftool = require("exiftool-vendored").exiftool;
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
app.set("view engine", "ejs");

const upload = multer({ dest: "uploads/" });
app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("video"), async (req, res) => {
  let videoDurationInSeconds;

  async function getDuration(req) {
    try {
      const duration = await getVideoDurationInSeconds(req.file.originalname);
      console.log("1", duration);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }

  getDuration(req);

  //   console.log(req.file.originalname);
  //   const filePath = req.file.path;

  //   // Get video metadata
  //   getVideoMetadata(filePath)
  //     .then((metadata) => {
  //       // Send metadata response
  //       res.json({ metadata });
  //       // Delete the uploads folder after sending metadata response
  //       deleteFilesInFolder(uploadFolderPath);
  //     })
  //     .catch((err) => {
  //       console.error("Error getting video metadata:", err);
  //       res.status(500).json({ error: "Error getting video metadata" });
  //       // If an error occurs, delete the uploads folder as well
  //       deleteFilesInFolder(uploadFolderPath);
  //     });
});

// Function to get video metadata
function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    exiftool
      .read(filePath)
      .then((metadata) => {
        resolve(metadata);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
const uploadFolderPath = "./uploads";
// getVideoDurationInSeconds("demo.mp4").then((duration) => {
//   console.log(duration);
// });
// Function to delete the uploads folder
function deleteFilesInFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${folderPath}: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err}`);
        } else {
          console.log(`File ${filePath} deleted successfully.`);
        }
      });
    });
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
