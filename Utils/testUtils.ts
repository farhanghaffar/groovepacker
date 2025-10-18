import test, { Locator, Page } from '@playwright/test';
import archiver from 'archiver';

export const waitforLocatorVisibility = async (
  page: Page,
  locator: Locator,
) => {
  let i = 0;
  let checkLocator = false;
  while (i < 6) {
    if (await locator.isVisible()) {
      checkLocator = true;
      break;
    } else {
      checkLocator = false;
      i++;
    }
    await page.waitForTimeout(500);
  }
  return checkLocator;
};

export const expo1ProtectedToken =
  '0e84b5d23e05dd07035ea7c2f21e3be4919254b9d0775bfac16802b49430ea1d';

export const generateUniqueID = (length: number) => {
  let id = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }

  return id;
};
import fs from 'fs';

export function zipDirectory(
  sourceDir: string,
  outPath: string,
): Promise<void> {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', (err: Error) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}
