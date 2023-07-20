function cantFindById({ type, id }: { type: string; id: string }) {
  const newName = `${type.toUpperCase()}_NOT_FOUND`

  const newMessage = `There is no such ${type.toUpperCase()} with the id [ ${id} ] !`

  const error = new Error(newMessage)
  error.name = newName
  error.message = newMessage

  throw error
}

function cantFindByNmae({ type, name }: { type: string; name: string }) {
  const newName = `${type.toUpperCase()}_NOT_FOUND`

  const newMessage = `There is no such ${type.toUpperCase()} with the id [ ${name} ] !`

  const error = new Error(newMessage)
  error.name = newName
  error.message = newMessage

  throw error
}

export const failure = {
  cantFindById,
  cantFindByNmae,
}
