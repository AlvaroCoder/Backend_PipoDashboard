function ValidateHasEmptyFields(jsonObject) {
    const keys = Object.keys(jsonObject);
    const hasEmpty = false;
    for (let index = 0; index < keys.length; index++) {
        if (jsonObject[keys[index]] == "" || jsonObject[keys[index]] == []) {
            hasEmpty = true;
        }
    }
    return hasEmpty;
}
function SumPriceProducts(products ) {
    let sumTotal = 0;
    for (let index = 0; index < products.length; index++) {
        let precioUnitario = products[index].precioUnitario;
        sumTotal+=precioUnitario;
    }
    return sumTotal;
}

function SumProducts(products) {
    let jsonResponse = {
        descuentoGlobal : 0,
        
    };
    for (let index = 0; index < products.length; index++) {
        const element = products[index];
    }
}

module.exports = {ValidateHasEmptyFields, SumPriceProducts}