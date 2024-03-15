import * as tf from "@tensorflow/tfjs"
import * as d3 from "d3"
import { unzipAndLoad } from "../Unzip/loadAndUnzip"

async function loadData() {
    const facesText = await unzipAndLoad("./anime_girls_2000x4096.csv.zip")
    const faces = tf.tensor2d(d3.csvParseRows(facesText, d3.autoType) as number[][])
    const facesArray = faces.arraySync() as number[][]
    const facesCentered = faces.sub(faces.mean(0))

    const eigenVectorsText = await unzipAndLoad("./eigenfaces-2000.csv.zip")
    const eigenVectors = tf.tensor2d(d3.csvParseRows(eigenVectorsText, d3.autoType) as number[][])
    const eigenVectorsNormalized = eigenVectors.sub(eigenVectors.min(1, true)).div(eigenVectors.max(1, true).sub(eigenVectors.min(1, true))).mul(tf.scalar(255)).toInt()
    const eigenVectorsNormalizedArray = eigenVectorsNormalized.arraySync() as number[][]

    return {facesArray, facesCentered, eigenVectors, eigenVectorsNormalizedArray}
}

export { loadData }