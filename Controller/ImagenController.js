const connection = require('../Services/Connection');
const conn2Db = connection.getInstance();
const {ErrorResponse, SuccesResponse} = require('../Models/HttpResponse');
const ConstructorImagen = require('../Models/ModelImagen');
const ComandosSQL = require('../Models/ComandosSQL');
const error = new ErrorResponse();
const success = new SuccesResponse();

const cloudinary = require('cloudinary').v2;

conn2Db.connect();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

class ImagenController{
    async guardarImagen(admin,imagen){
        try {
            const {originalname, filename} = imagen;
            const pathImg = `Public/Optimizado/optimizado-${filename}`
            const public_id = originalname.split('.')[0];
            const folder = admin.userAdmin;
            const rptaCloudinary = await cloudinary.uploader.upload(pathImg,{public_id,folder},(err,res)=>{
                if (err) {
                    throw err;
                }
                return res;
            });
            const idAdmin = await conn2Db.conn.query(ComandosSQL.Admin.mostrarIdAdmin,[admin.userAdmin]).then((res)=>res[0][0].idAdmin);
            const imagenJSON = new ConstructorImagen()
            .setIdAdmin(idAdmin)
            .setNombre(public_id)
            .setUrlPublico(rptaCloudinary.url)
            .setUrlSeguro(rptaCloudinary.secure_url)
            .construirSQL();
            const guardarImagen = await conn2Db.conn.query(ComandosSQL.Imagenes.guardarImagen,imagenJSON).then((res)=>res[0].insertId);
            return success.getSuccess(guardarImagen);
        } catch (err) {
            return error.getError(err);
        }
    }
}
module.exports = ImagenController;