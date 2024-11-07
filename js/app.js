function advancedShuffle(range, logDetails) {
  const outputIndex = new Set();
  let totalCounter = 0;
  const getRandomInt = (fromInc, toInc) =>
    Math.floor(Math.random() * (toInc - fromInc + 1) + fromInc);
  const fillSection = (fromInc, toInc, output) => {
    let unusedIndexMin = fromInc;
    let unusedIndexMax = toInc;
    for (i = fromInc; i < toInc; i++) {
      let rand;
      let debugCounter = 0;
      do {
        debugCounter++;
        rand = getRandomInt(unusedIndexMin, unusedIndexMax);
      } while (output.has(rand));
      totalCounter += debugCounter;
      output.add(rand);
      let edgeLookupCounter = 0;
      if (rand === unusedIndexMin) {
        do {
          edgeLookupCounter++;
          unusedIndexMin++;
        } while (unusedIndexMin < unusedIndexMax && output.has(unusedIndexMin));
      }
      if (rand === unusedIndexMax) {
        do {
          edgeLookupCounter++;
          unusedIndexMax--;
        } while (unusedIndexMax > unusedIndexMin && output.has(unusedIndexMax));
      }
      if (logDetails) {
        console.log(
          `${rand.toString().padStart(2)} ${unusedIndexMin
            .toString()
            .padStart(2)}..${unusedIndexMax
            .toString()
            .padStart(2, '.')} [${edgeLookupCounter
            .toString()
            .padStart(2)}] ${debugCounter.toString().padStart(3)} ${'█'.repeat(
            Math.min(debugCounter, 240)
          )}`
        );
      }
    }
  };
  // //starts to smell like recursion...
  // const splitPoint = getRandomInt(0, range);
  // outputIndex.add(splitPoint);
  // fillSection(0, splitPoint, outputIndex);
  // fillSection(splitPoint + 1, range, outputIndex);
  fillSection(0, range, outputIndex);

  if (logDetails) {
    console.log((' ' + totalCounter.toString()).padStart(18, '-'));
  }
  return Array.from(outputIndex.values());
}

async function getPictureList(doMix) {
  return new Promise((resolve, reject) => {
    let arrayClone = pictureSources.slice();
    if (doMix) {
      // for (let i = 0; i < 2; i++) {
      //   arrayClone.sort((a, b) => 1 - Math.round(Math.random() * 2));
      // }
      arrayClone = advancedShuffle(arrayClone.length).map(
        (val) => arrayClone[val]
      );
    }
    resolve(arrayClone);
  });
}

function renderImage(source, dstElement) {
  const imgElement = document.createElement('img');
  imgElement.src = source;
  imgElement.title = source.slice(
    source.indexOf('Photo_20') + 6,
    source.indexOf('.jpg') - 7
  );
  dstElement.appendChild(imgElement);
}

function shuffleRenderedImages(mixOrder) {
  document
    .querySelectorAll('#gallery img')
    .forEach((el, i) => (el.style.order = mixOrder[i]));
}

/**
 * a primitive implementation of non-standard https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
 * @param {*} element
 */
function scrollIntoViewIfNeeded(element) {
  const viewport = window.visualViewport;
  if (
    element.getBoundingClientRect()['bottom'] >
    viewport.offsetTop + viewport.height
  ) {
    element.scrollIntoView(false);
  }
}

async function placeAllImages(sources, dstElement) {
  return new Promise((resolve, reject) => {
    //1. clear DOM content
    while (dstElement.firstChild) {
      dstElement.removeChild(dstElement.firstChild);
    }
    //2. add all images
    for (src of sources) {
      renderImage(`assets/pictures/${src}`, dstElement);
    }
    //3. assign events to images
    dstElement.querySelectorAll('img').forEach((el) =>
      el.addEventListener('dblclick', (e) => {
        e.target.classList.toggle('enlarged');
        setTimeout(() => {
          scrollIntoViewIfNeeded(e.target);
        }, 100);
      })
    );
    resolve();
  });
}

const galleryElement = document.querySelector('#gallery');

document.querySelector('#button-show').addEventListener('click', async (e) => {
  await placeAllImages(await getPictureList(false), galleryElement);
});

document.querySelector('#button-mix').addEventListener('click', async (e) => {
  const num = galleryElement.querySelectorAll('img').length;
  shuffleRenderedImages(await advancedShuffle(num, e.ctrlKey));
});
