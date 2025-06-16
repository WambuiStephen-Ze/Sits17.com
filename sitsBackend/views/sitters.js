document.addEventListener("DOMContentLoaded", function () {
// Book buttons (for multiple sitters)
    const bookme = document.querySelectorAll(".bookme");

    bookme.forEach((button) => {
        button.addEventListener("click", function () {
            const name = this.parentNode.parentNode.querySelector(".box > .content > h3")?.textContent
            if (name)
                alert(`You have booked ${name}!`);
        });
    });
});