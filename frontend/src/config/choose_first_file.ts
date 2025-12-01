export default function chooseFirstFile(files: string[]) {
    if (!files) return undefined;

    return (
        files.find((fileName) => fileName.includes("Tezza")) ||
        files.find((fileName) => fileName.toLowerCase().includes("informe")) ||
        files[0]
    );
}