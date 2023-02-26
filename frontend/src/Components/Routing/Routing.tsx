import React from 'react'
import { Route, Routes } from 'react-router-dom';

type Props = {}

const Routing = (props: Props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<></>} />
                <Route path="/login" element={<></>} />
            </Routes>
        </>
    )
}

export default Routing