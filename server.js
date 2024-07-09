const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    try {
        const { videoUrl, format } = req.body;
        
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(videoUrl);
        const format_code = format === 'MP3 Audio' ? 'highestaudio' : 'highest';
        
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: format_code });

        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${format === 'MP3 Audio' ? 'mp3' : 'mp4'}"`);
        ytdl(videoUrl, { format: videoFormat }).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));