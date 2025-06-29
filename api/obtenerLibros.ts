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
      editorial:item.volumeInfo.publisher
    }))
  }
  catch{
    throw new Error("Error del API")
    return false
  }
}

export {ObtenerLibro}