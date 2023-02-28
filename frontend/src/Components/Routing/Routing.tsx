import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Lecture from '../Admin/Lecture/Lecture';
import AdminOverview from '../Admin/Overview/Overview';
import Login from '../Common/Login/Login';
import Checkout from '../User/Checkout/Checkout';
import LinkView from '../User/LinkView/LinkView';
import UserOverview from '../User/Overview/Overview';

type Props = {}

const Routing = (props: Props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<UserOverview />} />
                <Route path="/link/:share" element={<LinkView />} />
                <Route path="/link" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/lecture/:lectureid" element={<Lecture />} />
            </Routes>
        </>
    )
}

export default Routing