const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const audioFilePath = req.files.audioFile[0].path;
    const imageFilePath = req.files.imageFile[0].path;

    // Call Python script for feature extraction and prediction
    const results = await runPythonPipeline(audioFilePath, imageFilePath);

    // Determine the final conclusion based on the results
    const finalConclusion = determineConclusion(results.audioResult, results.imageResult);

    // Send results back to the client
    res.json({
      audioResult: results.audioResult,
      imageResult: results.imageResult,
      finalConclusion
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'An error occurred while processing the files.'
    });
  }
});

function determineConclusion(audioResult, imageResult) {
  if (audioResult === 'Emergency' && imageResult === 'Traffic') {
    return 'Traffic and Emergency';
  } else if (audioResult === 'Non-emergency' && imageResult === 'Traffic') {
    return 'Traffic and Non-emergency';
  } else if (audioResult === 'Emergency' && imageResult === 'No Traffic') {
    return 'Non-traffic and Emergency';
  } else {
    return 'Non-traffic and Non-emergency';
  }
}

async function runPythonPipeline(audioPath, imagePath) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['pipeline.py', audioPath, imagePath]);

    let data = '';
    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on('data', (error) => {
      console.error('Python error:', error.toString());
    });

    python.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(data));
        } catch (parseError) {
          reject(new Error('Failed to parse Python output.'));
        }
      } else {
        reject(new Error('Python script exited with error.'));
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
