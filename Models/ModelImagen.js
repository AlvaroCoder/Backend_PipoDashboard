const { fecha_creacion } = require("./Fechas");
const uuid = require('uuid');

class ConstructorImagen{
    constructor(){
        this.idImagen = uuid.v4();
        this.nombre = "";
        this.idAdmin = "";
        this.urlPublico = "";
        this.urlSeguro = "";
        this.fechaCreacion = fecha_creacion();
    }
    getIdImagen(){
        return this.idImagen;
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin;
        return this;
    }
    setNombre(nombre){
        this.nombre = nombre;
        return this;
    }
    setUrlPublico(urlPublico){
        this.urlPublico = urlPublico;
        return this;
    }
    setUrlSeguro(urlSeguro){
        this.urlSeguro = urlSeguro;
        return this;
    }
    construirSQL(){
        return [this.idAdmin, this.idImagen,this.nombre, this.urlPublico, this.urlSeguro, this.fechaCreacion]
    }
}

module.exports = ConstructorImagen;