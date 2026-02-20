const getBase64 = (img: Blob, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const result = reader.result;
        if (typeof result === 'string') {
            callback(result);
        }
    });
    reader.addEventListener('error', () => {
        console.error('FileReader failed to read file');
    });
    reader.readAsDataURL(img);
};

export default getBase64;
