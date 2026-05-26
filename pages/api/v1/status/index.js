function status(request, response) {
  response.status(200).send({
    message: 'hello!'
  })
}

export default status
