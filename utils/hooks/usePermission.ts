import * as ImagePicker from "expo-image-picker"

const grantPermission = async() => {
  try{
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if(!permissionResult.granted){
      alert('se requierem permisos para acceder a lagaleria')
    }
  }
  catch(err){
    console.error(err)
    throw new Error('error')
  }
}
export {grantPermission}