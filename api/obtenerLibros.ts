import type {Libro}  from "@/utils/types"


const URL = "https://www.googleapis.com/books/v1/volumes"

const ObtenerLibro = async(busqueda?: string) =>{
  try{
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${busqueda ? busqueda : "Harry Potter"}`).then(res=>res.json()).then(data=>data.items)
    return response.map((item:any) : Libro =>({
      id: item.id,
      titulo: item.volumeInfo.title,
      descripcion:item.volumeInfo.description,
      autor:item.volumeInfo.authors,
      imagen:item.volumeInfo.imageLinks.thumbnail,
      editorial:item.volumeInfo.publisher,
      link:item.selfLink
    }))
  }
  catch{
    throw new Error("Error del API")
    return false
  }
}

// Nueva función para obtener detalle de libro por ID
const ObtenerLibroPorId = async (id: string): Promise<Libro | null> => {
  try {
    const res = await fetch(`${URL}/${id}`);
    const data = await res.json();

    if (!data || data.error) {
      return null;
    }

    const item = data;

    const libroDetalle: Libro = {
      id: item.id,
      titulo: item.volumeInfo.title,
      descripcion: item.volumeInfo.description,
      autor: item.volumeInfo.authors,
      imagen: item.volumeInfo.imageLinks?.thumbnail,
      editorial: item.volumeInfo.publisher,
      link: item.selfLink,
    };

    return libroDetalle;
  } catch (error) {
    console.error("Error al obtener libro por ID:", error);
    return null;
  }
};

export { ObtenerLibro, ObtenerLibroPorId };
