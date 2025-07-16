import React from 'react'

const page = ({ params }) => {
    const { orgId } = params;

    return (
        <div>{orgId}</div>
    )
}

export default page