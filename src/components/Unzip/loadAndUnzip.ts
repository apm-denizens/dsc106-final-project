import JSZip from "jszip";

async function unzipAndLoad(url: string) {
    // Step 1: Fetch the zip file
    const response = await fetch(url);
    const blob = await response.blob();

    // Step 2: Read the zip file
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(blob);

    // Step 3: Extract and read the CSV file
    const csvFile = zip.file(url.replace("./", "").replace(".zip", ""));
    if (csvFile) {
        // Step 4: Convert to text
        const facesText = await csvFile.async("text");
        return facesText;
    }

    throw new Error("CSV file not found in zip archive");
}


export {unzipAndLoad};