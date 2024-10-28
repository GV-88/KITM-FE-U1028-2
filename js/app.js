async function getPictureList(doMix) {
  return new Promise((resolve, reject) => {
    const arrayClone = pictureSources.slice();
    if (doMix) {
      //TODO: come up with a better shuffle algorithm
      for (let i = 0; i < 2; i++) {
        arrayClone.sort((a, b) => 1 - Math.round(Math.random() * 2));
      }
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
