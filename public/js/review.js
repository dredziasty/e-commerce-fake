const buyAction = document.querySelector('.buy-action')
const reviewAction = document.querySelector('.review-action')
const reviewForm = document.querySelector('.review-form')

buyAction.addEventListener('click', async() => {
  try {
    const result = await axios.post(`/api/products/${buyAction.dataset.product}/buy`)
    if (result.status === 200) {
      await displayPopup('Kupiono produkt.', 'success', 2000)
      location.reload()
    }
  } catch (error) {
    await displayPopup('Musisz się zalogować, aby kupić ten produkt', 'error', 3000)
  }
})

reviewAction.addEventListener('click', async() => {
  try {
    const formData = new FormData(reviewForm)
    const productId = formData.get('productId')
    const rate = formData.get('rate')
    const name = formData.get('name')
    const review = formData.get('review')

    const result = await axios.post('/api/reviews', {
      productId,
      rate,
      name,
      review
    })

    if (result.status === 201) {
      reviewForm.reset()
      location.reload()
    }
  } catch (error) {
    await displayPopup('Żeby ocenić ten produkt musisz go pierwsze kupić oraz być zalogowany', 'error', 4000)
  }
})