import type {Libro}  from "@/utils/types"


const URL = "https://www.googleapis.com/books/v1/volumes"

const ObtenerLibro = async(busqueda?: string) :Promise<Libro[]> =>{
  try{
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${busqueda ? busqueda : "Harry Potter"}`).then(res=>res.json()).then(data=>data.items)
    const libros = response.map((item:any) : Libro =>{
      const url = item.volumeInfo.imageLinks.thumbnail
      return{
        id: item.id,
        titulo: item.volumeInfo.title,
        descripcion:item.volumeInfo.description,
        autor:item.volumeInfo.authors,
        imagen: url.replace(/^http:\/\//, "https://"),
        editorial:item.volumeInfo.publisher,
        link:item.selfLink
      }
    })
    return libros
  }
  catch{
    throw new Error("Error del API")
    return []
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
      imagen: item.volumeInfo.imageLinks?.thumbnail.replace(/^http:\/\//, "https://"),
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
