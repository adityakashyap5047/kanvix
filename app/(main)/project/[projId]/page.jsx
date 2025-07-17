import React from 'react'

const page = async ({params}) => {

  const projId = await params?.projId;

  return (
    <div>page {projId}</div>
  )
}

export default page