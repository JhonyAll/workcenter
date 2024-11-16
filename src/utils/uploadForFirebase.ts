import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Função para converter base64 para Blob
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

const handleUpload = (base64: string) => {
  const blob = base64ToBlob(base64);

  const fileName = `image_${Date.now()}.png`; // Nomeia o arquivo conforme necessário
  const storageRef = ref(storage, `images/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        alert(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default handleUpload;
