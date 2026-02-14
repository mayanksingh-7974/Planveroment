document.addEventListener("DOMContentLoaded", () => {

/* ========= SLIDER ========= */

const slides = document.querySelectorAll('.bg-slide');
let currentSlide = 0;

function nextSlide(){
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide+1)%slides.length;
  slides[currentSlide].classList.add('active');
}

let interval = setInterval(nextSlide,4000);

const slider = document.querySelector('.bg-slider-section');
slider.onmouseenter=()=>clearInterval(interval);
slider.onmouseleave=()=>interval=setInterval(nextSlide,4000);


/* ========= SMOOTH SCROLL ========= */

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.onclick=e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute("href"))
    .scrollIntoView({behavior:'smooth'});
  }
});


/* ========= DARK MODE ========= */

const toggle = document.createElement("button");
toggle.innerText="🌙";
toggle.style.marginLeft="10px";
document.querySelector(".nav-left").appendChild(toggle);

if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

toggle.onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark")?"dark":"light");
};


/* ========= SEARCH ========= */

const search = document.querySelector(".nav-search input");

search.onkeyup=()=>{
  const val=search.value.toLowerCase();

  document.querySelectorAll(".team-card").forEach(card=>{
    card.style.display =
      card.innerText.toLowerCase().includes(val)?"block":"none";
  });
};


/* ========= NAVBAR SHRINK ========= */

window.addEventListener("scroll",()=>{
  const nav=document.querySelector(".navbar");
  nav.style.height=window.scrollY>50?"60px":"80px";
});


/* ========= CONTACT FORM ========= */

const footer=document.querySelector(".footer");

footer.insertAdjacentHTML("beforeend",`
<div id="contactBox" style="margin-top:30px">
<h4>Send Message</h4>
<input id="cname" placeholder="Name"><br><br>
<input id="cemail" placeholder="Email"><br><br>
<textarea id="cmsg" placeholder="Message"></textarea><br><br>
<button id="sendBtn">Send</button>
<div id="toast"></div>
</div>
`);

document.getElementById("sendBtn").onclick=async()=>{
  const name=cname.value.trim();
  const email=cemail.value.trim();
  const message=cmsg.value.trim();

  if(!name||!email||!message){
    toast.innerText="Fill all fields!";
    return;
  }

  await fetch("/api/contact",{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name,email,message})
  });

  toast.innerText="Message sent ✔";
  cname.value=cemail.value=cmsg.value="";
};


/* ========= NEWSLETTER ========= */

footer.insertAdjacentHTML("beforeend",`
<br>
<input id="subEmail" placeholder="Subscribe email">
<button id="subBtn">Subscribe</button>
`);

subBtn.onclick=async()=>{
  await fetch("/api/subscribe",{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:subEmail.value})
  });

  alert("Subscribed ✔");
  subEmail.value="";
};

});
