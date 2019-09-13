const sharp = require('sharp');
const fse = require('fs-extra');
const walk = require('fs-walk');
const mkdirp = require('mkdirp');
const sizeOf = require('image-size');

// Sharp options
const options = {
    entry: 'src/img',
    jpeg : {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 80,
        progressive: true,
    },
    png: {
        compressionLevel: 9,
        progressive: false,
    }
}

const isLargeEnough = (size) => size >= 50000; // Bytes
const isJpeg = (type) => type == 'jpg';
const isPng = (type) => type == 'png';
const isPortraitOrSquare = (fileData) => fileData.width <= fileData.height;

walk.walk(options.entry, function(basedir, filename, stat, next) {
    if (stat.isFile()) {

        const destinationDir = basedir.replace('src/', '');
        const filePath = `${basedir}/${filename}`;

        if (isLargeEnough(stat.size)) {

            const fileData = sizeOf(filePath);

            let resizeWidth, resizeHeight;
            if (isPortraitOrSquare(fileData)) {
                resizeHeight = options.jpeg.maxWidth;
            } else {
                resizeWidth = options.jpeg.maxWidth;
            }

            if (isJpeg(fileData.type)) {

                (async () => {
                    await mkdirp(destinationDir);

                    await sharp(filePath)
                        .resize(resizeWidth, resizeHeight)
                        .jpeg({
                            quality: options.jpeg.quality,
                            progressive: options.jpeg.progressive,
                        })
                        .toFile(`${destinationDir}/${filename}`)
                        .then(data => console.log('+++++ Generating jpg:', filePath, `${destinationDir}/${filename}`))
                        .catch(err => console.error(err))
                })();

            } else if (isPng(fileData.type)) {
                (async () => {
                    await mkdirp(destinationDir);

                    await sharp(filePath)
                        .png({
                            progressive: options.png.progressive,
                            compressionLevel: options.png.compressionLevel,
                        })
                        .toFile(`${destinationDir}/${filename}`)
                        .then(data => console.log('+++++ Generating png:', filePath, `${destinationDir}/${filename}`))
                        .catch(err => console.error(err))
                })();
            }
        } else {

            fse.copy(filePath, `${destinationDir}/${filename}`)
                .then(() => console.log('##### Copying intact file:', filePath, `${destinationDir}/${filename}`))
                .catch(err => console.error(err))

        }

    } else if (stat.isDirectory()) {
        console.log('directory', basedir, filename);
    }

    next();

}, function(err) {
    if (err) console.log(err);
});