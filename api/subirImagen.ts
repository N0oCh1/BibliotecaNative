import { CurrentUser } from "@/utils/hooks/useAuthentication"
import { nanoid } from "nanoid/non-secure"
import { getDownloadURL, getStorage, ref, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";

const URL_STORAGE = "https://firebasestorage.googleapis.com/v0/b/bibliotecapty.firebasestorage.app"

const subirImagen = async(localURI: string|undefined) => {
  const id = nanoid(5);
  const fileType = "image/jpeg, image/png, image/jpg"
  const auth = await CurrentUser()

  if (!localURI) {
    return "https://firebasestorage.googleapis.com/v0/b/bibliotecapty.firebasestorage.app/o/placeholder.png?alt=media&token=8202fdf4-da9e-4c40-b332-a08d0ce26946"
  }

  const fileName = localURI.split("/").pop()!;
  const nombreEnStorage = `${id}${fileName}`

  const url = `${URL_STORAGE}/o?uploadType=media&name=${encodeURIComponent(nombreEnStorage)}`;

  // Leer el archivo como binario (blob compatible con fetch)
  const file = await fetch(localURI).then(res => res.blob());

  try {
    // Subir imagen binaria (sin metadatos aún)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": fileType,
        "Authorization": `Bearer ${(await auth).idToken}`
      },
      body: file
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al subir la imagen: ${error}`);
    }
    const storage = getStorage()
    const red = ref(storage,nombreEnStorage)
    const urlPublica = await getDownloadURL(red).then(url=>url)
    return urlPublica;
  } catch (err) {
    throw new Error("Error al subir la imagen");
  }
}

const eliminarImagen = async(nombre: string) => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("Usuario no autenticado");
  }
  try {
    const storage = getStorage();
    const fileRef = ref(storage, nombre);
    if(nombre !== "placeholder.png") {
      await deleteObject(fileRef);
    }
    return
  } catch (error) {
    return
  }
}

export { subirImagen, eliminarImagen }