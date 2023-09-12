class Fechas{
    static fecha_creacion(){
        const date = new Date();
        const fecha_creacion = date.getFullYear()+'-'+(date.getUTCMonth()+1).toString().padStart(2, "0")+'-'+date.getUTCDate().toString().padStart(2, "0");
        return fecha_creacion;
    }
}
module.exports = Fechas