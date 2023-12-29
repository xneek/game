export function saveAsFile(filename: string, data: any, blobProperty?: BlobPropertyBag) {
    const blob = new Blob([JSON.stringify(data, null, '  ')], blobProperty);
    const link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.click()
};