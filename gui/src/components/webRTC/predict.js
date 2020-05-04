export default async function predict(src, mobilenet, model, tf, handTrack, faceapi) {
  function cropImage(img) {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - (size / 2);
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - (size / 2);
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
  }

  async function findFace(img) {
    // ANYONE IN CAMERA?
    const detection = await faceapi.detectSingleFace(
      img,
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.03 })
    ); //.withFaceExpressions();
    // console.log(detection);
    return detection;
  }

  async function findHands(img) {
    // ANY HANDS IN CAMERA?

    // hands model
    const modelParams = { 
      flipHorizontal: true,   // flip e.g for video 
      imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
      maxNumBoxes: 20,        // maximum number of boxes to detect
      iouThreshold: 0.5,      // ioU threshold for non-max suppression
      scoreThreshold: 0.79,    // confidence threshold for predictions.
    }
    // Load the model.
    const handModel = await handTrack.load(modelParams);

    // detect objects in the image.
    const handPredictions = await handModel.detect(img)
    return handPredictions;
  }

  async function recognizeGestures(img) {
    // //  LOAD MOBILENET
    // let mobilenet = await tf.loadLayersModel(
    //   'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

    // // Return a model that outputs an internal activation.
    // const layer = mobilenet.getLayer('conv_pw_13_relu');
    // mobilenet = tf.model({ inputs: mobilenet.inputs, outputs: layer.output });

    // // IMAGE PROCESSING
    // // const model = await tf.loadLayersModel('http://localhost:3000/gest-model-2/model.json');
    // const model = await tf.loadLayersModel('http://localhost:3000/gest-model/model.json');

    const webcamImage = tf.browser.fromPixels(img);
    const reversedImage = webcamImage.reverse(1);

    // Crop the image so we're using the center square of the rectangular
    // webcam.
    const croppedImage = cropImage(reversedImage);
    // Expand the outer most dimension so we have a batch size of 1.
    const batchedImage = croppedImage.expandDims(0);
    // Normalize the image between -1 and 1. The image comes in between 0-255,
    // so we divide by 127 and subtract 1.
    const image = batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));

    // PREDICT
    const activation = mobilenet.predict(image);
    // Make a prediction through our newly-trained model using the activation
    // from mobilenet as input.
    const predictions = model.predict(activation);
    // Returns the index with the maximum probability. This number corresponds
    // to the class the model thinks is the most probable given the input.
    const res = await predictions.as1D().argMax().data();
    return res[0];
  }

  // MAIN.
  try {
    let actIndex;
    // Get snapshot.
    let snapshot = new Image(224, 224);
    snapshot.src = src//`http://localhost:3000/test-img/new/${imgName}.jpg`;

    // Find a face.
    const face = await findFace(snapshot);
    if (face) {
      // Find hands.
      const hands = await findHands(snapshot);
      console.log(hands);
      
      if (hands.length) {
        // Recognize gestures.
        actIndex = await recognizeGestures(snapshot);
      } else {
        // No hands.
        actIndex = 6;
      }
    } else {
      // Away.
      actIndex = 7;
    }
    // Фиксируем действие.
    return actIndex;
    // setStudentAction(actIndex);
  } catch (error) {
    console.log('smth wrong! ', error);
  }
}
