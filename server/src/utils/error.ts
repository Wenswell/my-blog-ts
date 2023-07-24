function cantFindByField({
  type,
  id,
  field,
}: {
  type: string
  id: string
  field: string
}) {
  const newName = `${type.toUpperCase()}_NOT_FOUND`

  const newMessage = `There is no such ${type.toUpperCase()} with the ${field.toUpperCase()} [ ${id} ] !`

  const error = new Error(newMessage)
  error.name = newName
  error.message = newMessage

  throw error
}

function alreadyExists({ type, name }: { type: string; name: string }) {
  const newName = `${type.toUpperCase()}_ALREADY_EXISTS`

  const newMessage = `The ${type.toUpperCase()} [ ${name} ] is already taken! Please choose another one.`

  const error = new Error(newMessage)
  error.name = newName
  error.message = newMessage

  throw error
}

function notYourToken({ account }: { account: string }) {
  const newName = `TOKEN_ATTRIBUTION_ERROR`

  const newMessage = `The token is valid, but it does not belong to the ${'account'.toUpperCase()} [ ${account} ].`

  const error = new Error(newMessage)
  error.name = newName
  error.message = newMessage

  throw error
}

function passowrdInvaild({ account }: { account: string }) {
  const type = 'password'
  const newName = `${type.toUpperCase()}_ERROR`

  const newMessage = `The ${type.toUpperCase()} of [ ${account} ] is error! Please try again.`

  const error = new Error(newMessage)
  error.name = newName
  error.message = newMessage

  throw error
}

export const failure = {
  cantFindByField,
  alreadyExists,
  passowrdInvaild,
  notYourToken,
}
