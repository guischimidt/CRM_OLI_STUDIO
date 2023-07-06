import api from '../utils/api';

import { useState, useEffect } from 'react';

function VerifyMessages() {
    const [schedules, setSchedules] = useState({});

    useEffect(() => {
        api.post('schedules/sendMessage')
            .then((response) => {
                setSchedules(response.data.schedules);
            })
    },[]);

    return (
        <section>Oi

        </section>
    )
}

export default VerifyMessages;