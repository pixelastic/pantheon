const path = require('path');
const _ = require('golgoth/lodash');
const got = require('golgoth/got');
const { remove, write, exist, download } = require('firost');
const fs = require('fs-extra');
const FormData = require('form-data');

module.exports = {
  /**
   * Download the record picture in ./src/pictures/
   * @param {object} record Record object
   * @returns {string} Path to the downloaded file
   **/
  async download(record) {
    const { slug, picture } = record;
    if (!picture) {
      return;
    }
    const extname = _.chain(picture)
      .split('.')
      .last()
      .replace('jpeg', 'jpg')
      .value();

    const downloadPath = path.resolve('./src/pictures', `${slug}.${extname}`);
    if (!(await exist(downloadPath))) {
      await download(picture, downloadPath);
    }
    return downloadPath;
  },
  async removeBackground(filepath) {
    const photoroomUrl = 'https://sdk.photoroom.com/v1/segment';

    const form = new FormData();
    form.append('image_file', fs.createReadStream(filepath));

    const response = await got.post(photoroomUrl, {
      headers: {
        'x-api-key': process.env.PHOTOROOM_API,
      },
      responseType: 'buffer',
      body: form,
    });

    if (response.body) {
      const extname = path.extname(filepath);
      const downloadPath = _.chain(filepath).replace(extname, '.png').value();
      await remove(filepath);
      await fs.writeFile(downloadPath, response.body);
    }
  },
};
