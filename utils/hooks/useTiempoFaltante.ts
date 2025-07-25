const calcularTiempoFaltante = (timestamp:string) => {
  const ahora = new Date().getTime();
  const devolucion = new Date(timestamp).getTime();
  const diferencia = devolucion - ahora;

  if (diferencia <= 0) {
    return "Ya venció";
  }

  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60) % 60;
  const horas = Math.floor(segundos / 3600) % 24;
  const dias = Math.floor(segundos / (3600 * 24));

  return `${dias}d ${horas}h ${minutos}m`;
}

export default calcularTiempoFaltante;