// console.log('Hello from app js')

import axios from "axios"
import Noty from "noty"

let addToCart = document.querySelectorAll('.add-to-cart')

let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        console.log(res)
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Item added to cart'
        }).show();

    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Somthing went wrong'
        }).show();
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        // console.log(e)

        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)

        // let pizza = btn.dataset.pizza
        // console.log(pizza)
    })
})