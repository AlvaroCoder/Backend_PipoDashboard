
async function fetchDniData(dni) {
    const URL_DNI = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBhcHV4NDVAZ21haWwuY29tIn0.agM_wX0-km4Uk21Tcj1_emDYRhd0ufXePIwgfRQtQxY`

    return fetch(URL_DNI, {
        method : 'GET'
    }).then(async (val) => {
        return await val.json()
    })
}

async function fetchRucData(ruc) {
    const URL_RUC = `https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBhcHV4NDVAZ21haWwuY29tIn0.agM_wX0-km4Uk21Tcj1_emDYRhd0ufXePIwgfRQtQxY`

    return fetch(URL_RUC,{
        method : 'GET'
    }).then(async (val)=>{
        return await val.json()
    })
}

module.exports = {fetchDniData, fetchRucData}