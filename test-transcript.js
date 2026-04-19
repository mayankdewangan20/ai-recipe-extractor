const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('dQw4w9WgXcQ'); // Rick roll, has CC
    console.log(transcript.slice(0, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
