import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Função para converter Base64 para Blob
const base64ToBlob = (base64: string) => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

// Função para fazer upload de arquivos ou Base64
const handleUpload = (input: File | string) => {
  let file: Blob;
  let extension = "unknown"; // Extensão padrão

  // Verifica se o input é Base64 ou um File
  if (typeof input === "string") {
    file = base64ToBlob(input); // Converte Base64 para Blob
    const mimeType = file.type;
    extension = mimeType.split("/")[1] || "unknown"; // Obtém a extensão a partir do MIME type
  } else {
    file = input; // O input já é do tipo File
    extension = input.name.split(".").pop() || "unknown"; // Obtém a extensão do nome do arquivo
  }

  const fileName = `file_${Date.now()}.${extension}`; // Nomeia o arquivo dinamicamente
  const storageRef = ref(storage, `uploads/${fileName}`); // Define a pasta de destino no Firebase Storage
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // Retorna a URL de download do arquivo
        } catch (error) {
          console.error("Failed to get download URL:", error);
          reject(error);
        }
      }
    );
  });
};

export default handleUpload;
