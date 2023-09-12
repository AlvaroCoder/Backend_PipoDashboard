const { fecha_creacion } = require("./Fechas");
const { ConstructorCliente } = require("./ModelPersona");

class ConstructorComprobante{
    constructor(){
        this.idAdmin = "";
        this.idCliente = "";
        this.idTienda = 0;
        this.tipoComprobante = 1;
        this.serieComprobante = "FF1";
        this.numeroComprobante = 12;
        this.fechaCreacion = fecha_creacion();
        this.productos = [];
        this.documento = 0;
        this.total = 0;
        this.cliente = {};
    }
    setSerieComprobante(serieComprobante){
        this.serieComprobante = serieComprobante;
        return this;
    }
    setTipoComprobante(tipoComprobante){
        this.tipoComprobante = tipoComprobante;
        return this;
    }
    setCliente(cliente){
        this.cliente = cliente;
        return this;
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin;
        return this;
    }
    setIdCliente(idCliente){
        this.idCliente = idCliente;
        return this;
    }
    setTotal(total){
        this.total = total;
        return this;
    }
    agregarProducto(producto){

    }
    generarJSONNubefact(){
        return {
            "operacion": "generar_comprobante",
            "tipo_de_comprobante": this.tipoComprobante,
            "serie": this.serieComprobante,
            "numero": this.numeroComprobante,
            "sunat_transaction": 1,
            "cliente_tipo_de_documento": this.cliente.documento.tipoDocumento,
            "cliente_numero_de_documento": this.cliente.documento.tipoDocumento,
            "cliente_denominacion": this.cliente.razSocial,
            "cliente_direccion": this.cliente.direccion,
            "cliente_email": this.cliente.email,
            "cliente_email_1": "",
            "cliente_email_2": "",
            "fecha_de_emision": this.fechaCreacion,
            "fecha_de_vencimiento": "",
            "moneda": 1,
            "tipo_de_cambio": "",
            "porcentaje_de_igv": 18.00,
            "descuento_global": "",
            "total_descuento": "",
            "total_anticipo": "",
            "total_gravada": 600,
            "total_inafecta": "",
            "total_exonerada": "",
            "total_igv": 108,
            "total_gratuita": "",
            "total_otros_cargos": "",
            "total": this.total,
            "percepcion_tipo": "",
            "percepcion_base_imponible": "",
            "total_percepcion": "",
            "total_incluido_percepcion": "",
            "retencion_tipo": "",
            "retencion_base_imponible": "",
            "total_retencion": "",
            "total_impuestos_bolsas": "",
            "detraccion": false,
            "observaciones": "",
            "documento_que_se_modifica_tipo": "",
            "documento_que_se_modifica_serie": "",
            "documento_que_se_modifica_numero": "",
            "tipo_de_nota_de_credito": "",
            "tipo_de_nota_de_debito": "",
            "enviar_automaticamente_a_la_sunat": true,
            "enviar_automaticamente_al_cliente": false,
            
        }
    }
}
module.exports = ConstructorComprobante;