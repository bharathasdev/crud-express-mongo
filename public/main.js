/* globals fetch */
var update = document.getElementById('update')
var del = document.getElementById('delete')
var nameView = document.getElementById('nameView')
var nameViewText = document.getElementById('nameViewText')


update.addEventListener('click', function () {
  fetch('quotes', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': 'Darth Vader',
      'quote': 'I find your lack of faith disturbing.'
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
})

del.addEventListener('click', function () {
  fetch('quotes', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'Darth Vader'
    })
  }).then(function (response) {
    window.location.reload()
  })
})

nameView.addEventListener('click', function () {
  fetch('single', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': nameViewText.value
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
})
