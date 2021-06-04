import React from 'react'

import ClientList from "../../components/ClientList/ClientList";

function ClientsLayout({children}) {
    return (
        <div className="clients__container">
            <ClientList/>
            <div className="client" style={{backgroundImage: "url('/images/main2.jfif')"}}>{children}</div>
        </div>
    )
}

export default ClientsLayout
