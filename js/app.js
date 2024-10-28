function advancedShuffle(range) {
  let unusedIndexMin = 0;
  let unusedIndexMax = range - 1;
  const outputIndex = new Array(range);
  for (i = 0; i < range; i++) {
    let rand;
    // let debugCounter = 0;
    do {
      // debugCounter++;
      rand = Math.floor(
        Math.random() * (unusedIndexMax - unusedIndexMin + 1) + unusedIndexMin
      );
    } while (outputIndex.includes(rand));
    outputIndex[i] = rand;
    if (rand === unusedIndexMin) {
      unusedIndexMin++;
    }
    if (rand === unusedIndexMax) {
      unusedIndexMax--;
    }
    // console.log(rand, debugCounter);
  }
  return outputIndex;
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
  ).sp;
  dstElement.appendChild(imgElement);
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
    dstElement
      .querySelectorAll('img')
      .forEach((el) =>
        el.addEventListener('dblclick', (e) =>
          e.target.classList.toggle('enlarged')
        )
      );
    resolve();
  });
}

const galleryElement = document.querySelector('#gallery');

document.querySelectorAll('#button-show, #button-mix').forEach((el) =>
  el.addEventListener('click', async (e) => {
    await placeAllImages(
      await getPictureList(e.target.id === 'button-mix'),
      galleryElement
    );
  })
);
