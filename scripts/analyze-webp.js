const fse = require("fs-extra");
const path = require("path");

/**
 * This module is just for fun-sies.
 * Looks at each pokemon image from both the webp and png variants.
 * Aggregates the sizes accordingly, and shows how much more size-efficient webp is.
 */
module.exports = async () => {
  // Input/output paths
  const assetPath = path.resolve(__dirname, "../public/img/pokemon-sugimori");

  const NUM_TO_ANALYZE = 649;
  const toAnalyze = Array.from({ length: NUM_TO_ANALYZE })
    .map((_, i) => i + 1)
    .map((pokeNum) => {
      return new Promise(async (resolve) => {
        try {
          const pngPath = path.join(assetPath, `${pokeNum}.png`);
          const webpPath = path.join(assetPath, `${pokeNum}.webp`);

          const pngSize = (await fse.stat(pngPath)).size;
          const webpSize = (await fse.stat(webpPath)).size;

          resolve([pngSize, webpSize]);
        } catch {
          resolve([0, 0]);
        }
      });
    });

  await Promise.all(toAnalyze)
    .then((sizes) =>
      sizes.reduce(
        (acc, size) => {
          acc[0] += size[0];
          acc[1] += size[1];
          return acc;
        },
        [0, 0],
      ),
    )
    .then(([aggPngSize, aggWebpSize]) => {
      console.log(
        `PNG size (${NUM_TO_ANALYZE} pngs): ${(
          aggPngSize / Math.pow(1024, 2)
        ).toFixed(3)} MB`,
      );
      console.log(
        `WEBP size (${NUM_TO_ANALYZE} webps): ${(
          aggWebpSize / Math.pow(1024, 2)
        ).toFixed(3)} MB`,
      );
      console.log(
        `WEBP is ${((aggWebpSize / aggPngSize) * 100).toFixed(2)}% of PNG`,
      );
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("DONE");
      process.exit();
    });
};

module.exports();
