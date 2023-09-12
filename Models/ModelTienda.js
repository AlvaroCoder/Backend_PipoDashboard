class Tienda{
    constructor(idAdmin, razSocial, direccion, nombre){
        this.idAdmin = idAdmin;
        this.razSocial = razSocial;
        this.direccion = direccion;
        this.nombre = nombre;
    }
}
class ConstructorTienda{
    constructor(){
        this.idAdmin = "";
        this.razSocial = 0;
        this.direccion = "";
        this.nombre = "";
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin;
        return this;
    }
    setRazSocial(razSocial){
        this.razSocial = razSocial;
        return this;
    }
    setDireccion(direccion){
        this.direccion = direccion;
        return this;
    }
    setNombre(nombre){
        this.nombre = nombre;
        return this;
    }
    construir(){
        return new Tienda(this.idAdmin, this.razSocial, this.direccion, this.nombre)
    }
    construirSQL(){
        return [this.idAdmin, this.razSocial, this.direccion, this.nombre]
    }
}
module.exports = ConstructorTienda;