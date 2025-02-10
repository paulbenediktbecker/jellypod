import {execSync, exec} from 'child_process';
import _ from 'lodash';
import fs from 'fs';
import {globSync} from 'glob';
import {ProgressBar} from 'ascii-progress';

import config from './services/config';
import synced from './services/synced';
import JellyfinService from './services/jellyfin';

const IPOD_PATH = '/ipod';

if (!fs.existsSync(IPOD_PATH)) {
  console.log(IPOD_PATH);
  throw new Error('iPod not found. Exiting...');
}

const promiseExec = (command: string) =>
  new Promise<void>((resolve, reject) =>
    exec(command, err => {
      if (err) {
        console.log('Exec error: ', err);
        reject(err);
      }

      resolve();
    }),
  );

const defaultBars = {
  blank: '░',
  filled: '█',
  schema: ' [:bar] :current/:total :percent :elapseds :title',
};


function getAllSongs(dirPath: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
          // Recurse into the subdirectory
          getAllSongs(filePath, fileList);
      } else if (path.extname(file).toLowerCase() === ".mp3") {
          // Add only .mp3 files to the list
          fileList.push(filePath);
      }
  }

  return fileList;
}

const main = async () => {

  // Import all songs up-front - then filter based on already synced items
  const allSongs = (getAllSongs("/musicdir")).filter(s => !synced.getId(s.Id));

  console.log('\nStarting Sync...\n');



  if (allSongs.length > 0) {
    console.log('Syncing songs...');

    
  }

  for (const f of allSongs) {
    let mappedPath: string = f


    try {
      const args = [
        `-m ${IPOD_PATH}`,
        `"${mappedPath}"`,
        mappedImagePath ? `--artwork "${mappedImagePath}"` : '',
        mappedPath.endsWith('.flac') ? '--decode=alac' : '',
      ];
      console.log(`gnupod_addsong ${args.join(' ')}`.trim() );
      await promiseExec(`gnupod_addsong ${args.join(' ')}`.trim());

      synced.setItem(f.Id);
    } catch (e) {
      console.log(e);
    }

    
  }
  
};

main().then(async () => {
  await new Promise(resolve => setTimeout(resolve, 10 * 1000));
  unmountVolumes();
  console.log('\nSync complete. Running mktunes...\n');
  execSync(`mktunes -m ${IPOD_PATH}`, {
    stdio: 'inherit',
  });
});
  