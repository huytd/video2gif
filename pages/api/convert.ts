import { NextApiRequest, NextApiResponse } from 'next'
import formidable, {Fields, Files} from 'formidable'
import ffmpeg from 'fluent-ffmpeg';
//@ts-ignore
import ffmpegBin from '@ffmpeg-auto-installer/ffmpeg';
import fs from 'fs';
import path from "path";
import * as os from "os";

ffmpeg.setFfmpegPath(ffmpegBin.path);

//set bodyparser
export const config = {
    api: {
        bodyParser: false
    }
};

interface RequestFormData {
    fields?: Fields,
    files?: Files
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const data: RequestFormData = await new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm()

        form.parse(req, (err, fields, files) => {
            if (err) reject({});
            resolve({ fields, files });
        });
    });

    if (data.files) {
        const { filepath, originalFilename } = data.files['source'] as formidable.File;
        const fps = +(data.fields?.['fps'] as string ?? "15");
        const width = +(data.fields?.['width'] as string ?? "480");

        const input = filepath;
        const tmpPath = os.tmpdir();
        const output = originalFilename!.replace('.mov', '.gif');

        const genPalette = ffmpeg(input).videoFilter(`fps=${fps},scale=${width}:-1:flags=lanczos,palettegen`).save(tmpPath + "/" + originalFilename! + '.png');
        genPalette.on('end', () => {
            const convertFile = ffmpeg(input).input(tmpPath + "/" + originalFilename! + '.png').complexFilter(`fps=${fps},scale=${width}:-1:flags=lanczos[x];[x][1:v]paletteuse`).save(tmpPath + "/" + output);
            convertFile.on('end', () => {
                const gifData = fs.readFileSync(tmpPath + "/" + output);
                res.setHeader('Content-Type', 'image/gif')
                    .setHeader('Content-Length', gifData.length)
                    .write(gifData);
            });
        });
    } else {
        res.status(400).json({
            status: 'error'
        })
    }
}