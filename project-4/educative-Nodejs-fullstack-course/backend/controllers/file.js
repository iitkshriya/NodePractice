const { File, validate } = require("../models/file");
const fs = require("fs");
const readline = require("readline");
const SpellChecker = require("simple-spellchecker").getDictionarySync("en-GB");
const stringSimilarity = require("string-similarity");
const sharp = require("sharp");

const BASE_URL = "https://ed-4775431022051328.educative.run";

const spellCheck = async (path) => {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    console: false,
  });

  let text = "";

  for await (const line of readInterface) {
    const correctedLine = line
      .split(" ")
      .map((word) => {
        if (!SpellChecker.spellCheck(word)) {
          const suggestions = SpellChecker.getSuggestions(word);

          const matches = stringSimilarity.findBestMatch(
            word,
            suggestions.length === 0 ? [word] : suggestions
          );

          return matches.bestMatch.target;
        }
        return word;
      })
      .join(" ");

    text += correctedLine + "\n";
  }

  fs.writeFile(`${path}.txt`, text, (err, res) => {
    if (err) console.log("error", err);
  });
};

const processImage = async (path) => {
  try {
    const imgInstnace = sharp(path);

    const newPath = path.split(".")[0] + "-img.jpeg";
    imgInstnace
      .resize({
        width: 350,
        fit: sharp.fit.contain,
      })
      .toFormat("jpeg", { mozjpeg: true })
      .blur(1)
      .composite([{ input: "uploads/logo.png", gravity: "center" }])
      .toFile(newPath);

    return newPath;
  } catch (error) {
    console.log(
      `An error occurred during processing the uploaded image: ${error}`
    );
  }

  return path;
};

exports.upload = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, description } = req.body;
    let path = req.file.path;

    if (req.file.mimetype === "text/plain") {
      await spellCheck(req.file.path);
      path = `${req.file.path}.txt`;
    }

    if (req.file.mimetype.match(/^image/)) {
      path = await processImage(req.file.path);
    }

    const file = await File.create({
      name,
      createdBy: req.user.user_id,
      description,
      createdAt: Date.now(),
      filePath: BASE_URL + "/" + path,
    });

    res.status(200).json({ message: "File uploaded successfully", data: file });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const createdBy = req.user.user_id;

    const allFiles = await File.find({ createdBy: createdBy });
    res
      .status(200)
      .json({ message: "Files retrieved successfully", data: allFiles });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

exports.getFile = async (req, res) => {
  try {
    const { createdBy, fileId } = req.params;

    const files = await File.findOne({ _id: fileId, createdBy: createdBy });

    if (!files) {
      return res.status(404).send("The requested file does not exist");
    }

    res
      .status(200)
      .json({ message: "File retrieved successfully", data: file });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

exports.searchFiles = async (req, res) => {
  try {
    const filter = {};

    if (req.query.name) filter.name = /req.query.name/;
    if (req.query.description) filter.description = /req.query.description/;
    if (req.query.createdAt) filter.createdAt = req.query.createdAt;

    const files = await File.find(filter);

    res
      .status(200)
      .json({ message: "Files retrieved successfully", data: files });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

exports.updateFile = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, description } = req.body;

    if (!name || !description)
      return res.status(400).send("File's name and description are required");

    const file = await File.findOne({
      _id,
    });

    if (!file) {
      return res.status(404).send("The requested file does not exist");
    }

    const updatedFile = await File.update(
      {
        _id,
      },
      {
        $set: { name, description },
      },
      { upsert: true }
    );

    res
      .status(200)
      .json({ message: "File updated successfully", data: updatedFile });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { _id } = req.params;
    const file = await File.findOne({
      _id,
    });

    if (!file) {
      return res.status(404).send("The requested file does not exist");
    }

    await File.remove({
      _id,
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};