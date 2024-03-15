import * as tf from '@tensorflow/tfjs'

function calculateProjections(
    facesCentered: tf.Tensor<tf.Rank>,
    eigenVectors: tf.Tensor2D, 
    eigenVector1Index: number, eigenVector2Index: number) {
    const twoEigenVectors = eigenVectors.gather([eigenVector1Index, eigenVector2Index]) 
    const projected = facesCentered.matMul(twoEigenVectors.transpose())

    return projected
}

export {calculateProjections};