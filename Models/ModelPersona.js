const uuid = require('uuid');
const {fecha_creacion} = require('./Fechas');
class Persona{
    constructor(idAdmin,documento, razSocial, telefono){
        this.idAdmin = idAdmin
        this.documento = documento;
        this.razonSocial = razSocial;
        this.telefono = telefono;
        this.fechaCreacion = "";
    }
}

class Cliente extends Persona{
    constructor(idAdmin, documento, razSocial, telefono, apellido, genero, fechaCumpleannos, detalle, estrellas){
        super(idAdmin, documento, razSocial, telefono);
        this.idCliente = uuid.v4();
        this.apellido = apellido;
        this.saldo = 0;
        this.genero = genero;
        this.fechaCumpleannos = fechaCumpleannos || "";
        this.detalle = detalle;
        this.estrellas = estrellas || 0;
    }
}

class ConstructorCliente{
    constructor(){
        this.idAdmin = "";
        this.idCliente = uuid.v4();
        this.documento = 0;
        this.razSocial = "";
        this.apellido = "";
        this.telefono = 0;
        this.saldo = 0;
        this.genero = "";
        this.fechaCumpleannos = "";
        this.detalle = "";
        this.estrellas = 0;
        this.email = "";
        this.direccion ="";
        this.fechaCreacion =fecha_creacion();
    }
    setIdCliente(idCliente){
        this.idCliente = idCliente;
        return this;
    }
    setEmail(email){
        this.email = email;
        return this;
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin;
        return this;
    }
    setApellido(apellido){
        this.apellido = apellido;
        return this;
    }
    setDocumento(documento){
        var doc = {
            numero : 0,
            tipo : "SIN DOCUMENTO",
            tipoDocumento : "-"
        }
        if (documento) {
            doc.numero = documento;
            if (String(documento).length==8) {
                doc.tipo = "DNI";
                doc.tipoDocumento = 1;
            }
            if (String(documento).length==11) {
                doc.tipo ="R.U.C";
                doc.tipoDocumento = 6;
            }
        }
        this.documento = doc;
        return this;
    }
    setTelefono(telefono){
        this.telefono = telefono;
        return this;
    }
    setDetalle(detalle){
        this.detalle = detalle;
        return this;
    }
    setEstrellas(estrellas){
        this.estrellas = estrellas;
        return this;
    }
    setDireccion(direccion){
        this.direccion = direccion ;
        return this;
    }
    setFechaCumpleannos(fecha_cumpleannos){
        this.fechaCumpleannos = fecha_cumpleannos;
        return this;
    }
    setGenero(genero){
        this.genero = genero || "";
        return this;
    }
    setRazonSocial(razonSocial){
        this.razSocial = razonSocial;
        return this;
    }
    construir(){
        return new Cliente(this.idAdmin,this.documento, this.razSocial, this.telefono, this.apellido, this.genero, this.fechaCumpleannos, this.detalle, this.estrellas)
    }
    construirJSON(){
        return {
            "idCliente": this.idCliente,
            "nombre":this.razSocial,
            "apellido":this.apellido,
            "documento":this.documento,
            "fechaCumpleannos":this.fechaCumpleannos,
            "telefono":this.telefono,
            "direccion":this.direccion,
            "saldo":this.saldo,
            "genero":this.genero
        }
    }
    construirSQLPersona(){
        return [this.idAdmin, this.documento.numero, this.razSocial, this.telefono, this.direccion, this.fechaCreacion]
    }
    construirSQLCliente(idPersona){
        return [this.idCliente, idPersona, this.apellido, this.saldo, this.genero, this.fechaCumpleannos, this.detalle, this.estrellas]
    }
}
class Proveedor extends Persona{
    
}
class ConstructorProveedor{
    constructor(){
        this.idAdmin = ""
        this.documento = 0;
        this.razSocial = 0;
        this.telefono = 0;
        this.direccion = "";
        this.fechaCreacion =fecha_creacion();
        this.detalle = "";
        this.email ="";
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin || "";
        return this;
    }
    setDocumento(documento){
        var doc = {
            numero : 0,
            tipo : "SIN DOCUMENTO",
            tipoDocumento : "-"
        }
        if (documento) {
            doc.numero = documento;
            if (String(documento).length==8) {
                doc.tipo = "DNI";
                doc.tipoDocumento = 1;
            }
            if (String(documento).length==11) {
                doc.tipo ="R.U.C";
                doc.tipoDocumento = 6;
            }
        }
        this.documento = doc;
        return this;
    }
    setRazSocial(razSocial){
        this.razSocial = razSocial || 0;
        return this;
    }
    setTelefono(telefono){
        this.telefono = telefono || 0;
        return this;
    }
    setDireccion(direccion){
        this.direccion = direccion || "";
        return this;
    }
    setDetalle(detalle){
        this.detalle = detalle || "";
        return this;
    }
    setEmail(email){
        this.email = email || "";
        return this;
    }
    setFechaCreacion(fechaCreacion){
        this.fechaCreacion = fechaCreacion;
        return this;
    }
    construirSQLPersona(){
        return [this.idAdmin, this.documento, this.razSocial, this.telefono, this.direccion, this.fechaCreacion]
    }
    construirSQLProveedor(idPersona){
        return [idPersona, this.detalle, this.email]
    }
    construirJSON(){
        return {
            "nombre":this.razSocial,
            "documento":this.documento,
            "fechaCreacion":this.fechaCreacion,
            "telefono":this.telefono,
            "direccion":this.direccion,
            "detalle":this.detalle,
            "email":this.email
        }
    }
}
module.exports = {ConstructorCliente, ConstructorProveedor};