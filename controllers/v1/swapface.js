'use strict';
/* eslint-disable */
const {spawn} = require('child_process');
var fs = require('fs');
var kill  = require('tree-kill');
const log = require('../../core/logger');

module.exports = { swapface, };

async function swapface(req) {
  try {
    console.error(process.env.SWAPFACE_KILL_PYTHON);
    console.error(process.env.SWAPFACE_BAT);
    console.error(process.env.SWAPFACE_ROOP_FOLDER);

    await cmdDestroy(process.env.SWAPFACE_KILL_PYTHON);

    const data = req.body;
    console.error(1);
    let m =  req.body.face._imageAsDataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let base64Data =  Buffer.from(m[2],'base64');
    const fileName = data.hasPhone ? '569_' + data.phone: 'SINTELEFONO_'+ data.phone;
    const source = process.env.SWAPFACE_IMAGE_FOLDER + `${fileName}`;
    console.error(2);

    await writeImage(source, base64Data);
    const swapfaceObj = {
      source: source + '.jpg',
      target: process.env.SWAPFACE_TARGET_FOLDER+ data.target,
      output: process.env.SWAPFACE_OUTPUT_FOLDER+ fileName + '.mp4',
    }
    console.error(3);

    console.error(swapfaceObj);
    await readWriteAsync(swapfaceObj);
    let response = await cmd(process.env.SWAPFACE_BAT);
    console.error(4);

    if(response !== -1){
      //read the file
      const file_buffer  = await fs.readFileSync(swapfaceObj.output);
      //encode contents into base64
      response = 'data:video/mp4;base64,' + file_buffer.toString('base64');
      console.error(6);

      return response;
    }
    console.error(5);

    return response;
  } catch (error) {
    return error;
  }
}

async function writeImage(source, base64Data){
  return new Promise((resolve) => {
    fs.writeFile(source + '.jpg', base64Data, 'base64', function(err) {
      if (err) reject(err);
      else resolve(base64Data);
    });
});
}

function cmd(command) {
  let p = spawn(command, {windowsHide: true});
    return new Promise((resolve) => {
    let response = -1;
    p.stdout.on("data", (x) => {
      log.messageInfo(x.toString());
      console.error(x.toString());
      if (x.toString().includes('Processing to video succeed!')){
        console.error('error', 'bien');
        response = 1;
        kill(p.pid);
        resolve(response);
      } else if (x.toString().includes('No face in source path detected.')){
        console.error('error', 'mal');
        response = -1;
        kill(p.pid);
        resolve(response);
      }
    p.stderr.on("data", (x) => {
      response = -1;
    });
    });
    p.on("exit", () => {
      kill(p.pid);
      resolve(response);
    });
  });
}

function cmdDestroy(command) {
  let p = spawn(command, {windowsHide: true});
    return new Promise((resolve) => {

    p.stdout.on("data", (x) => {
      console.error(x.toString());
    p.stderr.on("data", (x) => {
    });
    });
    p.on("exit", () => {
      kill(p.pid);
      resolve();
    });
  });
}

async function readWriteAsync(data) {
  await fs.readFile(process.env.SWAPFACE_BAT, 'utf-8', function(err){
    if (err) throw err;
    let templateReplace = `@echo off
    cd /d ${process.env.SWAPFACE_ROOP_FOLDER_VENV}
    call activate
    cd /d ${process.env.SWAPFACE_ROOP_FOLDER}
    python run.py --keep-frames --keep-fps --temp-frame-quality 100 --output-video-quality 30 --execution-provider cuda --frame-processor face_swapper face_enhancer  -s "DATA_SOURCE" -t "DATA_TARGET" -o "DATA_OUTPUT"`;

    templateReplace = templateReplace.replace('DATA_SOURCE', data.source);
    templateReplace = templateReplace.replace('DATA_TARGET', data.target);
    templateReplace = templateReplace.replace('DATA_OUTPUT', data.output);
    fs.writeFile(process.env.SWAPFACE_BAT, templateReplace, 'utf-8', function (err) {
      if (err) throw err;
    });
  });
}
