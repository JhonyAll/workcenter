import { storage } from "@/lib/firebase";
import { getDownloadURL,ref, uploadBytesResumable } from "firebase/storage";

const handleUpload = (file: File) => {
    let url;

    if (!file) return;
    
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          url = downloadURL;
        });
      }
    );

    return url
  };

  export default handleUpload