import React from 'react'

function Login({match}) {
    return (
        <div>
            {match.path === "/clientlogin" ?
                <h2>Client Login</h2>
                :
                <h2>Trainer Login</h2>
            }
        </div>
    )
}

export default Login