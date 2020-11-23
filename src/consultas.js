/* 1ª consulta: Muestra los coches cuya potencia máxima en el motor de combustión es mayor o igual a 100, 
siempre que tengan tracción delantera */

db.coches.find({$and: [
    {"potenciamax.combustion": {$gte: 100}, traccion: "delantera"}]}).pretty()

/* 2ª consulta: Muestra los coches cuyo modelo empieza con la combinación "BMW" y su potencia máxima del motor
eléctrico es mayor a 50*/

db.coches.find({$and: [
    {modelo: {$regex: /^BMW/}, "potenciamax.elect": {$gt: 50}}]}).pretty()

/* 3ª consulta: Muestra los coches que tienen únicamente motor de combustión y consumen 15 litros o más, o los 
que solo tienen motor eléctrico y tracción total */ 

db.coches.find({$or: [
    {$and: [{"potenciamax.combustion": {$exists: true}, "consumo.cantidad": {$gte: 15}}]},
    {$and: [{"potenciamax.elect": {$exists: true}, traccion: "total"}]}
]}).pretty()

/* 4ª consulta: Muestra los coches que se fabricaron entre enero y abril de 2018, o los que se fabricaron durante 2019
y son berlinas */

db.coches.find({$or: [
    {$and: [{"fechafabricacion": {"$gt": new Date("2013,01,01")}}, {"fechafabricacion": {"$lt": new Date("2015,04,01")}}]},
    {$and: [{"fechafabricacion": {"$gt": new Date("2019,01,01")}}, {"fechafabricacion": {"$lt": new Date("2019,12,31")}}, {carroceria: {$eq: "berlina"}}]}
]}).pretty()

/* 5ª consulta: Muestra los coches que únicamente tienen motor eléctrico y son tracción delantera */

db.coches.find({ $and: [
    {"potenciamax.combustion": {$exists: false}, carroceria: {$eq: "turismo"}}
]}).pretty()

/* 6ª consulta: Muestra los coches que además de tener únicamente motor de combustión, no consumen más de 
13 litros y tienen una aceleración menor a 10 segundos, o que son híbridos (motor de combustión y motor eléctrico) 
y miden menos de 4700 mm de largo */

db.coches.find({$or: [
    {$and: [{"potenciamax.elect": {$exists: false}, "consumo.cantidad": {$lt: 13}, aceleracion: {$lt: 10}}]},
    {$and: [{"potenciamax.combustion": {$exists: true}, "potenciamax.elect": {$exists: true}, "dimensiones.largo": {$lte: 4700}}]}
]}).pretty()

/* 7ª consulta: Muestra los coches que no son tracción delantera, no empiezan por la letra "B" y tienen un consumo menor a
10 o, los que son tracción delantera y son manuales */

db.coches.find({$or: [
    {$and: [{traccion: {$ne: "delantera"}, modelo: {$not: {$regex: /^B/}}, "consumo.cantidad": {$lte: 10}}]},
    {$and: [{traccion: {$eq: "delantera"}, manual: true}]}
]}).pretty()

/* 8ª consulta: Muestra la relación peso/potencia de todos los coches en función a la potencia máxima del motor de
combustión. */

db.coches.aggregate(
    [
        {$project: {relacionpp: {$divide: ["$peso.coche", "$potenciamax.combustion"]}}}
    ]
)

/* 9ª consulta: Muestra la diferencia de potencia entre los dos motores de los coches cuyo nombre acabe en "n" */

db.coches.aggregate([
    {$match: {modelo: {$regex: /n$/}}},
    {$project: {potenciatotal: {$subtract: ["$potenciamax.combustion", "$potenciamax.elect"]}}}])

/* 10ª consulta: Muestra los coches cuya altura no sea menor a 1600 mm y no sean todoterrenos */

db.coches.find( { $nor: [ { "dimensiones.altura": { $lt: 1600 } }, {carroceria: {$eq: "todoterrenos"}}]})

/* 11ª consulta: Muestra los coches que se hayan fabricado en 2018 y tengan una velocidad maxima superior a 220, o los
se han fabricado en 2019 y consumen menos de 10 */

db.coches.find({$or: [
    {$and: [{"fechafabricacion": {"$gte": new Date("2018,01,01")}}, {"fechafabricacion": {"$lte": new Date("2018,12,31")}, velocidadmax: {$gte: 220}}]},
    {$and: [{"fechafabricacion": {"$gte": new Date("2019,01,01")}}, {"fechafabricacion": {"$lte": new Date("2019,12,31")}, "consumo.cantidad": {$lte: 10}}]}
]})

