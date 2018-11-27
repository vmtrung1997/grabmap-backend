var axios = require('axios');
const key = '36afe134-b09c-40f3-90dd-0e2b1e95f4a9'

exports.pointToDriver = function (request, driver) {
    let point1 = request.position;
    let point2 = driver.position;
    let url = 'https://graphhopper.com/api/1/route?point=' + point1.lat + ',' + point1.lng
        +'&point='+ point2.lat + ',' + point2.lng + '&vehicle=car&debug=true&key=' + key
        + '&type=json&points_encoded=false';

    return new Promise((res, rej) => {
        axios.get(url).then(data => {
            res({driver: driver,request: request._id, path: data.data.paths[0]});
        }).catch(error => {
            rej(error)
        })
    }
    )
}
