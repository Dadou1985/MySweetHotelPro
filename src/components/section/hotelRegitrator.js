import React from 'react'
import { db } from "../../Firebase"
import hotel from '../../../hotels/'

export default function HotelRegitrator() {

    const hotelRegistrator = ({hotelId, hotelName, classement, adresse, room, phone, mail, website, region, departement, code_postal, city, lat, lng}) => {
        return db.collection("hotels")
        .doc(`${hotelId}`)
        .set({
          hotelName: hotelName,
          classement: classement,
          adresse: adresse,
          room: room,
          phone: phone,
          mail: mail,
          website: website,
          region: region,
          departement: departement,
          code_postal: code_postal,
          city: city,
          lat: lat,
          lng: lng,
          partnership: false,
          country: "FRANCE",
          markup: Date.now()
        })
    }
        
    return (
        <div>
            
            {/*hotel.forEach( doc => (
                hotelRegistrator({
                    hotelId: doc.recordid,
                    //arrondissement: doc.fields.code_postal,
                    hotelName: doc.fields.nom_commercial,
                    classement: doc.fields.classement,
                    adresse: doc.fields.adresse,
                    room: doc.fields.nombre_de_chambres,
                    phone: doc.fields.telephone,
                    mail: doc.fields.courriel,
                    website: doc.fields.site_internet,
                    region: doc.fields.nom_reg,
                    departement: doc.fields.nom_dep,
                    code_postal: doc.fields.code_postal,
                    city: doc.fields.commune,
                    lat: doc.geometry.coordinates[1],
                    lng: doc.geometry.coordinates[0]})
                    
                
                ))*/}
                
        </div>
    )
}
