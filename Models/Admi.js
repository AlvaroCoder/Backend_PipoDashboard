class Administrador {
    constructor(idAdmin,razon_social,documento,usuario,email,contrasenna, contrasenna_hash){
        this.idAdmin = idAdmin;
        this.razon_social = razon_social;
        this.documento = documento;
        this.usuario = usuario;
        this.email = email;
        this.contrasenna = contrasenna;
        this.contrasenna_hash = contrasenna_hash;
    }
    construirSQL(){
        return [this.idAdmin, this.razon_social, this.documento, this.usuario, this.email, this.contrasenna, this.contrasenna_hash]
    }
}
class ConstructorAdmi{
    constructor(){
        this.idAdmin = "";
        this.razonSocial = "";
        this.documento = 0;
        this.usuario = "";
        this.email = "";
        this.contrasenna = "";
        this.contrasenna_hash = "";
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin;
        return this;
    }
    setUsuario(usuario){
        this.usuario =  usuario;
        return this;
    }
    setDocumento(documento){
        this.documento = documento;
        return this;
    }
    setRazonSocial(razonSocial){
        this.razonSocial = razonSocial;
        return this;
    }
    setEmail(email){
        this.email = email;
        return this;
    }
    setContrasenna(contrasenna){
        this.contrasenna = contrasenna;
        return this;
    }
    setContrasennaHash(contrasenna_hash){
        this.contrasenna_hash = contrasenna_hash;
        return this;
    }
    construir(){
        return new Administrador(this.idAdmin,this.razonSocial,this.documento, this.usuario, this.email, this.contrasenna, this.contrasenna_hash);
    }
}
module.exports = {ConstructorAdmi};