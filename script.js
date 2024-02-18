

// burgur 

let drop_item_nav = document.querySelector('.drop-item');
let navbar = document.querySelector('#navbar');
let nav_list = document.querySelector(".nav-list");
let nav_listall = document.querySelectorAll("#navbar>ul>li");
let lines = document.getElementsByClassName("line")

drop_item_nav.addEventListener("click", () => {
    navbar.classList.toggle("h-nav-resp");
    nav_list.classList.toggle("v-class-resp");
    for (element of nav_listall) {
        element.classList.toggle("apair");
    };
    lines[0].classList.toggle("rotate-left");
    lines[1].classList.toggle("rotate-right");
    lines[2].classList.toggle("line-display-none")
    drop_item_nav.classList.toggle('drop-item-height')
});
