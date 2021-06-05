import React from 'react';

const TrainerContext = React.createContext({
    userProfile:null,
    trainerId:"",
    programs:null,
    clients:null
});

export default TrainerContext

