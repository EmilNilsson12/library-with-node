const btns = document.querySelectorAll('button');

btns.forEach(btn => {
    btn.addEventListener('click', addToCart)
});

function addToCart(e) {
    console.log(e.target.parentNode);
}